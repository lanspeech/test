const highlights = [
  {
    title: 'Expressive tooling',
    description:
      'Compose prompts with live previews, versioning, and an intuitive canvas tailored for creative teams.',
    accent: 'from-brand-primary/90 to-brand-secondary/80',
  },
  {
    title: 'Collaborative reviews',
    description:
      'Collect feedback with moodboards, emoji reactions, and curated stories that keep experiments playful.',
    accent: 'from-brand-secondary/80 to-brand-accent/80',
  },
  {
    title: 'Confident delivery',
    description:
      'Ship polished prompt packs into production workflows backed by analytics, testing, and governance.',
    accent: 'from-brand-accent/90 to-brand-primary/90',
  },
];

export default function HomePage() {
  return (
    <section className="mx-auto max-w-5xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 font-mono text-sm uppercase tracking-[0.2em] shadow-dreamy">
        <span className="size-2 rounded-full bg-brand-secondary" aria-hidden="true" />
        Prompt Studio
      </span>
      <h1 className="mt-8 font-display text-4xl leading-tight text-brand-primary shadow-glow sm:text-6xl">
        Design AI prompt journeys with heart
      </h1>
      <p className="mt-6 text-lg text-brand-ink/80 sm:text-xl">
        A creative workspace for crafting vibrant, trustworthy prompts your team will adore. Dream,
        prototype, and launch in a single flow.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3 font-semibold text-white shadow-dreamy transition hover:-translate-y-0.5 hover:bg-brand-secondary"
          href="#get-started"
        >
          Start exploring
        </a>
        <a
          className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-ink/10 bg-white/80 px-6 py-3 font-semibold text-brand-ink shadow-sm transition hover:-translate-y-0.5 hover:border-brand-primary/40 hover:text-brand-primary"
          href="#learn-more"
        >
          See how it works
        </a>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
        {highlights.map((highlight) => (
          <article
            key={highlight.title}
            className="rounded-xl border border-white/40 bg-white/80 p-6 shadow-glow backdrop-blur"
          >
            <div
              className={`inline-flex rounded-full bg-gradient-to-r ${highlight.accent} px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white`}
            >
              {highlight.title}
            </div>
            <p className="mt-4 text-sm text-brand-ink/80">{highlight.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
