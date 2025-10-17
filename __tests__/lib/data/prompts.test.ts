import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as promptsData from '@/lib/data/prompts';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => {
  const findMany = vi.fn();
  const findUnique = vi.fn();
  const create = vi.fn();
  const count = vi.fn();
  const groupBy = vi.fn();

  return {
    default: {
      prompt: {
        findMany,
        findUnique,
      },
      viewLog: {
        create,
        count,
        groupBy,
      },
      tag: {
        findMany,
      },
    },
  };
});

const prismaMock = prisma as unknown as {
  prompt: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
  };
  viewLog: {
    create: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
    groupBy: ReturnType<typeof vi.fn>;
  };
  tag: {
    findMany: ReturnType<typeof vi.fn>;
  };
};

describe('prompts data access', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchViewCounts', () => {
    it('returns empty object for empty array', async () => {
      const result = await promptsData.fetchViewCounts([]);

      expect(result).toEqual({});
      expect(prismaMock.viewLog.groupBy).not.toHaveBeenCalled();
    });

    it('aggregates view counts by promptId', async () => {
      const mockAggregates = [
        { promptId: 'prompt-1', _count: { promptId: 5 } },
        { promptId: 'prompt-2', _count: { promptId: 3 } },
      ];

      prismaMock.viewLog.groupBy.mockResolvedValue(mockAggregates);

      const result = await promptsData.fetchViewCounts(['prompt-1', 'prompt-2']);

      expect(result).toEqual({
        'prompt-1': 5,
        'prompt-2': 3,
      });
    });
  });

  describe('recordPromptView', () => {
    it('creates a view log with all fields', async () => {
      const input = {
        promptId: 'prompt-1',
        userId: 'user-1',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
      };

      const mockViewLog = { id: 'view-1', ...input, createdAt: new Date() };
      prismaMock.viewLog.create.mockResolvedValue(mockViewLog);

      const result = await promptsData.recordPromptView(input);

      expect(result).toEqual(mockViewLog);
      expect(prismaMock.viewLog.create).toHaveBeenCalledWith({
        data: input,
      });
    });

    it('creates a view log with optional fields undefined', async () => {
      const input = {
        promptId: 'prompt-1',
      };

      const mockViewLog = {
        id: 'view-1',
        promptId: 'prompt-1',
        userId: undefined,
        ipAddress: undefined,
        userAgent: undefined,
        createdAt: new Date(),
      };
      prismaMock.viewLog.create.mockResolvedValue(mockViewLog);

      await promptsData.recordPromptView(input);

      expect(prismaMock.viewLog.create).toHaveBeenCalledWith({
        data: input,
      });
    });
  });

  describe('getPromptViewCount', () => {
    it('returns count for given promptId', async () => {
      prismaMock.viewLog.count.mockResolvedValue(42);

      const result = await promptsData.getPromptViewCount('prompt-1');

      expect(result).toBe(42);
      expect(prismaMock.viewLog.count).toHaveBeenCalledWith({
        where: { promptId: 'prompt-1' },
      });
    });
  });
});
