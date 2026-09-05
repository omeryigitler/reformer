import { WhatsAppIcon } from "./WhatsAppIcon";

type BookActionProps = {
  onBook: () => void;
};

export function FirstSessionSection({ onBook }: BookActionProps) {
  return (
    <section className="rpm-section-first-session rpm-surface-base px-5 py-[88px] md:px-10 md:py-36 lg:px-14">
      <div className="mx-auto max-w-[1500px]">
        <div
          data-reveal
          className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="rpm-text-kicker mb-4 text-[10px] font-semibold uppercase tracking-[0.34em]">
              First session
            </p>
            <h2 className="font-serif text-[clamp(4rem,8vw,9rem)] leading-[0.84] tracking-[-0.055em]">
              NEW
              <br />
              HERE?
            </h2>
          </div>
          <p className="rpm-text-copy-strong max-w-md text-base leading-relaxed">
            Start with a considered introduction to Reformer Pilates and discover the right pace
            for your practice.
          </p>
        </div>

        <button
          type="button"
          onClick={onBook}
          className="rpm-action-first-session rpm-border-action flex w-full items-center justify-between border-y py-7 text-left"
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
    <section className="rpm-section-booking rpm-surface-panel relative min-h-[82svh] overflow-hidden">
      <img
        src="/premium/booking_cta_1788398803233.jpg"
        alt=""
        loading="lazy"
        decoding="async"
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
          className="rpm-action-booking rpm-action-surface mt-9 inline-flex w-fit items-center gap-4 rounded-full px-6 py-4 text-xs font-semibold uppercase tracking-[0.19em]"
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
      className="rpm-floating-whatsapp fixed bottom-5 right-5 z-[70] grid h-14 w-14 place-items-center rounded-full shadow-xl transition hover:scale-105 md:bottom-7 md:right-7"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  );
}
