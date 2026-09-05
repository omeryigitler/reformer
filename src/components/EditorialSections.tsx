const proofItems = [
  ["SMALL", "GROUPS"],
  ["EXPERT", "GUIDANCE"],
  ["ST JULIAN’S", "MALTA"],
];

export function StudioSection() {
  return (
    <section className="rpm-section-studio rpm-surface-base px-5 py-[88px] md:px-10 md:py-36 lg:px-14">
      <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
        <div data-reveal>
          <p className="rpm-text-kicker mb-5 text-[10px] font-semibold uppercase tracking-[0.34em]">
            The studio
          </p>
          <h2 className="font-serif text-[clamp(3.8rem,7vw,8rem)] leading-[0.86] tracking-[-0.055em]">
            A DIFFERENT
            <br />
            KIND OF
            <br />
            STUDIO.
          </h2>
        </div>
        <div data-reveal className="lg:pb-2">
          <img
            src="/premium/studio_reveal_1788398858603.jpg"
            alt="Sunlit Pilates studio in Malta"
            decoding="async"
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="rpm-border-strong mt-6 grid gap-5 border-t pt-5 md:grid-cols-2">
            <p className="rpm-text-copy max-w-md text-base leading-relaxed">
              Natural Mediterranean light, intentional coaching and a focused Reformer practice —
              without the noise of a large gym.
            </p>
            <p className="rpm-text-muted text-sm leading-relaxed md:text-right">
              St Julian&apos;s · Malta
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProofSection() {
  return (
    <section className="rpm-section-proof rpm-surface-secondary rpm-border-line border-y px-5 py-16 md:px-10 md:py-20 lg:px-14">
      <div className="rpm-proof-grid mx-auto grid max-w-[1500px] divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
        {proofItems.map(([top, bottom], index) => (
          <div
            data-reveal
            key={top}
            className={`py-9 md:px-10 md:py-6 ${index === 0 ? "md:pl-0" : ""}`}
          >
            <p className="rpm-text-proof-muted mb-8 text-[10px] font-semibold uppercase tracking-[0.32em]">
              0{index + 1}
            </p>
            <p className="font-serif text-5xl leading-[0.9] tracking-[-0.045em] md:text-6xl">
              {top}
              <br />
              {bottom}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function InstructorSection() {
  return (
    <section className="rpm-section-instructor rpm-surface-base px-5 py-[88px] md:px-10 md:py-36 lg:px-14">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div data-reveal>
            <img
              src="/premium/instructor_portrait_1788398788875.jpg"
              alt="Reformer Pilates instructor"
              loading="lazy"
              decoding="async"
              className="ml-auto aspect-[3/4] w-[86%] rounded-[999px] object-cover md:ml-0 md:aspect-[4/5] md:w-full md:rounded-none"
            />
          </div>
          <div data-reveal className="lg:pl-12">
            <p className="rpm-text-kicker mb-5 text-[10px] font-semibold uppercase tracking-[0.34em]">
              Your practice
            </p>
            <h2 className="font-serif text-[clamp(4rem,7vw,8rem)] leading-[0.86] tracking-[-0.055em]">
              MOVEMENT,
              <br />
              WITH
              <br />
              INTENTION.
            </h2>
            <p className="rpm-text-copy-strong mt-8 max-w-lg text-base leading-relaxed md:text-lg">
              Thoughtful instruction, clear progression and attention to detail — so every session
              feels challenging, purposeful and personal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
