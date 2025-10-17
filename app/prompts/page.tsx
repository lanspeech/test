import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/prisma';

export default async function PromptsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const prompts = await prisma.prompt.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return (
    <section>
      <div className="max-w-4xl">
        <h1 className="font-display text-4xl text-brand-primary">Prompts library</h1>
        <p className="mt-2 text-sm text-brand-ink/70">
          Explore saved prompt blueprints curated by your team. Only authenticated creators can browse this
          collection.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {prompts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-ink/20 bg-white/70 p-8 text-center text-brand-ink/70">
            No prompts found yet. Start by creating one in the builder.
          </div>
        ) : (
          prompts.map((prompt) => (
            <article
              key={prompt.id}
              className="flex h-full flex-col rounded-2xl border border-white/60 bg-white/90 p-6 shadow-glow backdrop-blur transition hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-brand-primary">{prompt.title}</h2>
                  {prompt.user ? (
                    <p className="mt-1 text-xs text-brand-ink/60">
                      By {prompt.user.name ?? prompt.user.email}
                    </p>
                  ) : null}
                </div>
                {prompt.featured ? (
                  <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold uppercase text-brand-primary">
                    Featured
                  </span>
                ) : null}
              </div>

              {prompt.description ? (
                <p className="mt-4 text-sm text-brand-ink/80">{prompt.description}</p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                {prompt.tags.map((tagRelation) => (
                  <span
                    key={`${prompt.id}-${tagRelation.tagId}`}
                    className="inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-primary"
                  >
                    {tagRelation.tag?.name ?? 'Tag'}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-brand-ink/60">
                <span>Last updated {prompt.updatedAt.toLocaleDateString()}</span>
                <Link href="#" className="font-semibold text-brand-primary hover:underline">
                  View details
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
