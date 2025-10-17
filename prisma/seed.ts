import {
  PrismaClient,
  SubscriptionPlan,
  SubscriptionStatus,
  UserRole,
} from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  const [adminPasswordHash, demoPasswordHash] = await Promise.all([
    hash('AdminPass123!', 12),
    hash('DemoPass123!', 12),
  ]);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@promptstudio.dev' },
    update: {
      passwordHash: adminPasswordHash,
      emailVerified: new Date(),
    },
    create: {
      email: 'admin@promptstudio.dev',
      name: 'Admin User',
      role: UserRole.ADMIN,
      passwordHash: adminPasswordHash,
      emailVerified: new Date(),
    },
  });

  console.log('Created admin user:', adminUser.email);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@promptstudio.dev' },
    update: {
      passwordHash: demoPasswordHash,
      emailVerified: new Date(),
    },
    create: {
      email: 'demo@promptstudio.dev',
      name: 'Demo User',
      role: UserRole.USER,
      passwordHash: demoPasswordHash,
      emailVerified: new Date(),
    },
  });

  console.log('Created demo user:', demoUser.email);

  const tagData = [
    { name: 'Creative Writing', slug: 'creative-writing', color: '#EC4899' },
    { name: 'Code Generation', slug: 'code-generation', color: '#8B5CF6' },
    { name: 'Data Analysis', slug: 'data-analysis', color: '#10B981' },
    { name: 'Marketing', slug: 'marketing', color: '#F59E0B' },
    { name: 'Education', slug: 'education', color: '#3B82F6' },
    { name: 'Productivity', slug: 'productivity', color: '#06B6D4' },
    { name: 'Social Media', slug: 'social-media', color: '#F472B6' },
    { name: 'SEO', slug: 'seo', color: '#6366F1' },
  ];

  for (const tag of tagData) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }

  console.log(`Created ${tagData.length} tags`);

  const creativeWritingTag = await prisma.tag.findUniqueOrThrow({
    where: { slug: 'creative-writing' },
  });
  const codeGenTag = await prisma.tag.findUniqueOrThrow({
    where: { slug: 'code-generation' },
  });
  const dataAnalysisTag = await prisma.tag.findUniqueOrThrow({
    where: { slug: 'data-analysis' },
  });
  const marketingTag = await prisma.tag.findUniqueOrThrow({
    where: { slug: 'marketing' },
  });
  const productivityTag = await prisma.tag.findUniqueOrThrow({
    where: { slug: 'productivity' },
  });

  const prompt1 = await prisma.prompt.upsert({
    where: { id: 'seed-prompt-1' },
    update: {},
    create: {
      id: 'seed-prompt-1',
      title: 'Story Starter Generator',
      description:
        'Generate creative and engaging opening lines for short stories based on a genre and theme.',
      content:
        'You are a creative writing assistant specializing in crafting compelling story openings. Generate 3 unique opening lines for a {{genre}} story with the theme of {{theme}}. Each opening should hook the reader and establish a distinct tone.',
      model: 'gpt-4',
      temperature: 0.9,
      published: true,
      featured: true,
      userId: adminUser.id,
      tags: {
        create: [{ tagId: creativeWritingTag.id }],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
            alt: 'Typewriter with paper',
            order: 0,
          },
        ],
      },
    },
  });

  const prompt2 = await prisma.prompt.upsert({
    where: { id: 'seed-prompt-2' },
    update: {},
    create: {
      id: 'seed-prompt-2',
      title: 'React Component Generator',
      description:
        'Generate production-ready React components with TypeScript, proper typing, and best practices.',
      content:
        'Create a React TypeScript component named {{componentName}} that {{description}}. Include:\n1. Proper TypeScript types/interfaces\n2. Props validation\n3. Clear JSDoc comments\n4. Responsive design with Tailwind CSS\n5. Accessibility attributes\n6. Error handling where appropriate',
      model: 'gpt-4',
      temperature: 0.3,
      published: true,
      featured: true,
      userId: adminUser.id,
      tags: {
        create: [
          { tagId: codeGenTag.id },
          { tagId: productivityTag.id },
        ],
      },
    },
  });

  const prompt3 = await prisma.prompt.upsert({
    where: { id: 'seed-prompt-3' },
    update: {},
    create: {
      id: 'seed-prompt-3',
      title: 'Data Insights Analyzer',
      description:
        'Analyze datasets and extract meaningful insights with visualizations recommendations.',
      content:
        'Analyze the following dataset: {{dataset}}. Provide:\n1. Key statistical insights (mean, median, outliers)\n2. Notable trends and patterns\n3. Correlations between variables\n4. Recommendations for visualizations\n5. Actionable business insights\n\nFormat your response with clear sections and bullet points.',
      model: 'gpt-4',
      temperature: 0.5,
      published: true,
      featured: false,
      userId: demoUser.id,
      tags: {
        create: [
          { tagId: dataAnalysisTag.id },
          { tagId: productivityTag.id },
        ],
      },
    },
  });

  const prompt4 = await prisma.prompt.upsert({
    where: { id: 'seed-prompt-4' },
    update: {},
    create: {
      id: 'seed-prompt-4',
      title: 'Email Campaign Optimizer',
      description: 'Craft compelling marketing emails with high engagement potential.',
      content:
        'Create an email campaign for {{product}} targeting {{audience}}. Include:\n1. Subject line (A/B test options)\n2. Preview text\n3. Email body with clear CTA\n4. Personalization tokens\n5. Mobile-optimized formatting suggestions\n\nTone: {{tone}}',
      model: 'gpt-4',
      temperature: 0.7,
      published: true,
      featured: false,
      userId: demoUser.id,
      tags: {
        create: [{ tagId: marketingTag.id }],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3',
            alt: 'Email on laptop screen',
            order: 0,
          },
        ],
      },
    },
  });

  console.log('Created sample prompts');

  await prisma.subscription.upsert({
    where: { id: 'seed-subscription-1' },
    update: {},
    create: {
      id: 'seed-subscription-1',
      userId: adminUser.id,
      plan: SubscriptionPlan.PRO,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  await prisma.subscription.upsert({
    where: { id: 'seed-subscription-2' },
    update: {},
    create: {
      id: 'seed-subscription-2',
      userId: demoUser.id,
      plan: SubscriptionPlan.FREE,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  console.log('Created subscriptions');

  await prisma.viewLog.createMany({
    data: [
      { promptId: prompt1.id },
      { promptId: prompt1.id },
      { promptId: prompt1.id },
      { promptId: prompt2.id },
      { promptId: prompt2.id },
      { promptId: prompt3.id },
    ],
    skipDuplicates: true,
  });

  console.log('Created view logs');
  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
