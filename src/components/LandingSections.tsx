import { WhatsAppIcon } from "./WhatsAppIcon";

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
      <WhatsAppIcon />
    </a>
  );
}
