const proofItems = [
  ["SMALL", "GROUPS"],
  ["EXPERT", "GUIDANCE"],
  ["ST JULIAN’S", "MALTA"],
];

export function StudioSection() {
  return (
    <section className="rpm-section-studio bg-[#F6F3EC] px-5 py-24 md:px-10 md:py-36 lg:px-14">
      <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
        <div data-reveal>
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#6F715F]">
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
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="mt-6 grid gap-5 border-t border-[#25271F]/18 pt-5 md:grid-cols-2">
            <p className="max-w-md text-base leading-relaxed text-[#505244]">
              Natural Mediterranean light, intentional coaching and a focused Reformer practice —
              without the noise of a large gym.
            </p>
            <p className="text-sm leading-relaxed text-[#707263] md:text-right">
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
    <section className="rpm-section-proof border-y border-[#25271F]/12 bg-[#EEE8DD] px-5 py-16 md:px-10 md:py-20 lg:px-14">
      <div className="mx-auto grid max-w-[1500px] divide-y divide-[#25271F]/14 md:grid-cols-3 md:divide-x md:divide-y-0">
        {proofItems.map(([top, bottom], index) => (
          <div
            data-reveal
            key={top}
            className={`py-9 md:px-10 md:py-6 ${index === 0 ? "md:pl-0" : ""}`}
          >
            <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#777968]">
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
    <section className="rpm-section-instructor bg-[#F6F3EC] px-5 py-24 md:px-10 md:py-36 lg:px-14">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div data-reveal>
            <img
              src="/premium/instructor_portrait_1788398788875.jpg"
              alt="Reformer Pilates instructor"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div data-reveal className="lg:pl-12">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#6F715F]">
              Your practice
            </p>
            <h2 className="font-serif text-[clamp(4rem,7vw,8rem)] leading-[0.86] tracking-[-0.055em]">
              MOVEMENT,
              <br />
              WITH
              <br />
              INTENTION.
            </h2>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-[#555748] md:text-lg">
              Thoughtful instruction, clear progression and attention to detail — so every session
              feels challenging, purposeful and personal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

type BookActionProps = {
  onBook: () => void;
};

export function FirstSessionSection({ onBook }: BookActionProps) {
  return (
    <section className="rpm-section-first-session bg-[#F6F3EC] px-5 py-24 md:px-10 md:py-36 lg:px-14">
      <div className="mx-auto max-w-[1500px]">
        <div
          data-reveal
          className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#6F715F]">
              First session
            </p>
            <h2 className="font-serif text-[clamp(4rem,8vw,9rem)] leading-[0.84] tracking-[-0.055em]">
              NEW
              <br />
              HERE?
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-[#555748]">
            Start with a considered introduction to Reformer Pilates and discover the right pace
            for your practice.
          </p>
        </div>

        <button
          type="button"
          onClick={onBook}
          className="rpm-action-first-session flex w-full items-center justify-between border-y border-[#25271F]/20 py-7 text-left"
        >
          <span className="rpm-action-label text-sm font-semibold uppercase tracking-[0.21em]">
            Start your first session
          </span>
          <span className="rpm-action-arrow" aria-hidden="true">
            ↗
          </span>
        </button>
      </div>
    </section>
  );
}

export function BookingCtaSection({ onBook }: BookActionProps) {
  return (
    <section className="rpm-section-booking relative min-h-[82svh] overflow-hidden bg-[#25271F] text-[#F6F3EC]">
      <img
        src="/premium/booking_cta_1788398803233.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-[#20221B]/35" />
      <div className="relative z-10 mx-auto flex min-h-[82svh] max-w-[1500px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-20 lg:px-14">
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.34em] text-white/65">
          Book your practice
        </p>
        <h2 className="max-w-6xl font-serif text-[clamp(4.5rem,10vw,11rem)] leading-[0.8] tracking-[-0.06em]">
          READY
          <br />
          WHEN
          <br />
          YOU ARE.
        </h2>
        <button
          type="button"
          onClick={onBook}
          className="rpm-action-booking mt-9 inline-flex w-fit items-center gap-4 rounded-full bg-[#F6F3EC] px-6 py-4 text-xs font-semibold uppercase tracking-[0.19em] text-[#25271F]"
        >
          <span>View available sessions</span>
          <span className="rpm-action-arrow" aria-hidden="true">
            ↗
          </span>
        </button>
      </div>
    </section>
  );
}

export function FloatingWhatsApp({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rpm-floating-whatsapp fixed bottom-5 right-5 z-[70] grid h-14 w-14 place-items-center rounded-full bg-[#25271F] text-[#F6F3EC] shadow-xl transition hover:scale-105 md:bottom-7 md:right-7"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}
