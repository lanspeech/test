import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

const promptInclude = {
  user: true,
  images: {
    orderBy: {
      order: 'asc' as const,
    },
  },
  tags: {
    include: {
      tag: true,
    },
    orderBy: {
      tag: {
        name: 'asc' as const,
      },
    },
  },
} satisfies Prisma.PromptInclude;

export type PromptWithRelations = Prisma.PromptGetPayload<{
  include: typeof promptInclude;
}>;

export type PromptWithAnalytics = Omit<PromptWithRelations, 'tags'> & {
  viewCount: number;
  tags: Prisma.TagGetPayload<Record<string, never>>[];
};

export type PromptQueryOptions = {
  tagSlugs?: string[];
  authorId?: string;
  search?: string;
  featuredOnly?: boolean;
  publishedOnly?: boolean;
  take?: number;
  skip?: number;
};

export async function listPrompts(options: PromptQueryOptions = {}): Promise<PromptWithAnalytics[]> {
  const {
    tagSlugs,
    authorId,
    search,
    featuredOnly,
    publishedOnly = true,
    take,
    skip,
  } = options;

  const where: Prisma.PromptWhereInput = {};

  if (Array.isArray(tagSlugs) && tagSlugs.length > 0) {
    where.tags = {
      some: {
        tag: {
          slug: {
            in: tagSlugs,
            mode: 'insensitive',
          },
        },
      },
    };
  }

  if (authorId) {
    where.userId = authorId;
  }

  if (featuredOnly != null) {
    where.featured = featuredOnly;
  }

  if (publishedOnly) {
    where.published = true;
  }

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        content: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  const prompts = await prisma.prompt.findMany({
    where,
    include: promptInclude,
    orderBy: {
      createdAt: 'desc',
    },
    take,
    skip,
  });

  const viewCounts = await fetchViewCounts(prompts.map((prompt) => prompt.id));

  return prompts.map((prompt) => {
    const { tags, ...promptWithoutTags } = prompt;

    return {
      ...promptWithoutTags,
      tags: tags.map((promptTag) => promptTag.tag),
      viewCount: viewCounts[prompt.id] ?? 0,
    } satisfies PromptWithAnalytics;
  });
}

export async function getPromptById(promptId: string): Promise<PromptWithAnalytics | null> {
  const prompt = await prisma.prompt.findUnique({
    where: { id: promptId },
    include: promptInclude,
  });

  if (!prompt) {
    return null;
  }

  const viewCounts = await fetchViewCounts([prompt.id]);
  const { tags, ...promptWithoutTags } = prompt;

  return {
    ...promptWithoutTags,
    tags: tags.map((promptTag) => promptTag.tag),
    viewCount: viewCounts[prompt.id] ?? 0,
  } satisfies PromptWithAnalytics;
}

export type RecordViewInput = {
  promptId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
};

export async function recordPromptView(input: RecordViewInput) {
  return prisma.viewLog.create({
    data: {
      promptId: input.promptId,
      userId: input.userId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  });
}

export async function getPromptViewCount(promptId: string) {
  return prisma.viewLog.count({
    where: {
      promptId,
    },
  });
}

export async function fetchViewCounts(promptIds: string[]) {
  if (promptIds.length === 0) {
    return {} as Record<string, number>;
  }

  const aggregates = await prisma.viewLog.groupBy({
    by: ['promptId'],
    _count: {
      promptId: true,
    },
    where: {
      promptId: {
        in: promptIds,
      },
    },
  });

  return aggregates.reduce<Record<string, number>>((acc, aggregate) => {
    acc[aggregate.promptId] = aggregate._count.promptId;
    return acc;
  }, {});
}

export async function listTagsWithUsage() {
  const tags = await prisma.tag.findMany({
    include: {
      prompts: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return tags.map((tag) => ({
    ...tag,
    promptCount: tag.prompts.length,
  }));
}
