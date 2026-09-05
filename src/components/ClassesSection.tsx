import { PRACTICES } from "../content/practice";
import { useClassesScrollMotion } from "../motion/useClassesScrollMotion";

export function ClassesSection() {
  const { sectionRef, trackRef } = useClassesScrollMotion();

  return (
    <section
      ref={sectionRef}
      className="rpm-section-classes rpm-surface-panel relative overflow-hidden"
    >
      <div className="rpm-classes-mobile overflow-hidden px-0 pb-14 pt-24 md:hidden">
        <p className="mx-5 mb-4 text-[10px] uppercase tracking-[0.32em] text-white/55">
          Find your flow
        </p>
        <h2 className="mx-5 mb-12 font-serif text-6xl leading-[.9] tracking-[-0.05em]">
          CLASSES
        </h2>
        <div className="rpm-classes-mobile-track flex">
          {PRACTICES.map((practice) => (
            <article key={practice.key} className="rpm-class-card">
              <img
                src={practice.image}
                alt={`${practice.label} Reformer class`}
                className="aspect-[3/4] w-full rounded-[999px] object-cover"
              />
              <div className="flex items-end justify-between border-b border-white/20 py-5">
                <div>
                  <p className="mb-2 text-[10px] tracking-[0.3em] text-white/45">
                    {practice.eyebrow}
                  </p>
                  <h3 className="font-serif text-5xl tracking-[-0.04em]">{practice.label}</h3>
                </div>
              </div>
              <p className="pt-4 text-sm text-white/62">{practice.subtitle}</p>
            </article>
          ))}
        </div>
      </div>

      <div
        ref={trackRef}
        data-class-track
        className="rpm-classes-desktop-track hidden h-[100svh] w-max items-stretch will-change-transform md:flex"
      >
        <div className="rpm-classes-intro-panel flex h-full w-screen shrink-0 flex-col justify-end px-10 pb-14 pt-32 lg:px-14">
          <p className="mb-6 text-[10px] uppercase tracking-[0.34em] text-white/55">Classes</p>
          <h2 className="font-serif text-[clamp(6rem,12vw,12rem)] leading-[.78] tracking-[-0.06em]">
            FIND
            <br />
            YOUR
            <br />
            FLOW.
          </h2>
        </div>

        {PRACTICES.map((practice) => (
          <article
            key={practice.key}
            className="rpm-class-panel relative h-full w-[82vw] shrink-0 overflow-hidden border-l border-white/10 lg:w-[64vw]"
          >
            <img
              src={practice.image}
              alt={`${practice.label} Reformer class`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,15,.05),rgba(18,20,15,.62))]" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-10 lg:p-14">
              <p className="mb-5 text-[10px] font-semibold tracking-[0.32em] text-white/60">
                {practice.eyebrow}
              </p>
              <h3 className="font-serif text-[clamp(5rem,9vw,10rem)] leading-none tracking-[-0.055em]">
                {practice.label}
              </h3>
              <p className="mt-5 text-base text-white/75">{practice.subtitle}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
