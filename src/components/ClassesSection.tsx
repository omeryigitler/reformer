import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const classes = [
  {
    eyebrow: "01",
    title: "BEGIN",
    subtitle: "Foundation · Control · Confidence",
    image: "/premium/787cc875-3817-4fdc-a070-9fe5233dbade.png",
  },
  {
    eyebrow: "02",
    title: "BUILD",
    subtitle: "Strength · Stability · Progression",
    image: "/premium/pill-reformer.jpg",
  },
  {
    eyebrow: "03",
    title: "SCULPT",
    subtitle: "Flow · Endurance · Precision",
    image: "/premium/pill-mat.jpg",
  },
  {
    eyebrow: "04",
    title: "PRIVATE",
    subtitle: "Personal · Focused · Yours",
    image: "/premium/pill-private.jpg",
  },
];

export function ClassesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const track = section.querySelector<HTMLElement>("[data-class-track]");
        if (!track) return;

        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="rpm-section-classes relative overflow-hidden bg-[#25271F] text-[#F6F3EC]"
    >
      <div className="rpm-classes-mobile px-5 pb-12 pt-24 md:hidden">
        <p className="mb-4 text-[10px] uppercase tracking-[0.32em] text-white/55">
          Find your flow
        </p>
        <h2 className="mb-12 font-serif text-6xl leading-[.9] tracking-[-0.05em]">CLASSES</h2>
        <div className="rpm-classes-mobile-track space-y-10">
          {classes.map((item) => (
            <article key={item.title} className="rpm-class-card">
              <img
                src={item.image}
                alt={`${item.title} Reformer class`}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="flex items-end justify-between border-b border-white/20 py-5">
                <div>
                  <p className="mb-2 text-[10px] tracking-[0.3em] text-white/45">{item.eyebrow}</p>
                  <h3 className="font-serif text-5xl tracking-[-0.04em]">{item.title}</h3>
                </div>
              </div>
              <p className="pt-4 text-sm text-white/62">{item.subtitle}</p>
            </article>
          ))}
        </div>
      </div>

      <div
        data-class-track
        className="hidden h-[100svh] w-max items-stretch will-change-transform md:flex"
      >
        <div className="flex h-full w-screen shrink-0 flex-col justify-end px-10 pb-14 pt-32 lg:px-14">
          <p className="mb-6 text-[10px] uppercase tracking-[0.34em] text-white/55">Classes</p>
          <h2 className="font-serif text-[clamp(6rem,12vw,12rem)] leading-[.78] tracking-[-0.06em]">
            FIND
            <br />
            YOUR
            <br />
            FLOW.
          </h2>
        </div>

        {classes.map((item) => (
          <article
            key={item.title}
            className="relative h-full w-[82vw] shrink-0 overflow-hidden border-l border-white/10 lg:w-[64vw]"
          >
            <img
              src={item.image}
              alt={`${item.title} Reformer class`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,15,.05),rgba(18,20,15,.62))]" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-10 lg:p-14">
              <p className="mb-5 text-[10px] font-semibold tracking-[0.32em] text-white/60">
                {item.eyebrow}
              </p>
              <h3 className="font-serif text-[clamp(5rem,9vw,10rem)] leading-none tracking-[-0.055em]">
                {item.title}
              </h3>
              <p className="mt-5 text-base text-white/75">{item.subtitle}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
