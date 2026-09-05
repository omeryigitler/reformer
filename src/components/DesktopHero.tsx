import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import { PRACTICES } from "../content/practice";
import { useDesktopHeroMotion } from "../motion/useDesktopHeroMotion";

type HeroColumn =
  | { id: number; type: "empty" }
  | {
      id: number;
      type: "pill";
      hoverWord: string;
      label: string;
      img: string;
      h: string;
      mt: string;
    };

const gridColumns: HeroColumn[] = [
  { id: 0, type: "empty" },
  { id: 1, type: "empty" },
  ...PRACTICES.map(
    (practice): HeroColumn => ({
      id: practice.heroColumnId,
      type: "pill",
      hoverWord: practice.key,
      label: practice.label,
      img: practice.image,
      h: practice.desktopHeightClass,
      mt: practice.desktopOffsetClass,
    })
  ),
];

export function DesktopHero() {
  const heroRef = useRef<HTMLElement>(null);
  const [activeCol, setActiveCol] = useState<number | null>(null);

  useDesktopHeroMotion(heroRef);

  return (
    <section
      ref={heroRef}
      className="rpm-desktop-hero relative h-[100svh] overflow-hidden bg-[#F6F3EC]"
      style={{ "--hero-type-axis-y": "50%" } as CSSProperties}
    >
      <div className="rpm-desktop-hero-background-grid absolute inset-0 z-0 grid grid-cols-6 divide-x divide-[#25271F]/10 pointer-events-none" />

      <div
        data-hero-elements
        className="absolute bottom-10 left-6 z-50 hidden pointer-events-none md:left-10 md:block"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] leading-relaxed text-[#25271F]">
          Controlled Movement
          <br />
          Intentional Practice
          <br />
          <br />
          <span className="text-[#25271F]/50">St Julian&apos;s · Malta</span>
        </p>
      </div>

      <div
        data-hero-elements
        className="absolute bottom-10 right-6 z-50 flex flex-col items-center gap-2 pointer-events-none md:right-10"
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#25271F]/50">
          Scroll
        </span>
        <ArrowDown size={14} className="rpm-desktop-scroll-arrow animate-bounce text-[#25271F]" />
      </div>

      <div className="rpm-desktop-hero-grid absolute inset-0 z-10 grid grid-cols-6">
        {gridColumns.map((column, index) => (
          <div
            key={column.id}
            className={`group relative flex h-full w-full items-center justify-center overflow-hidden border-r border-[#25271F]/10 last:border-0 ${
              column.type === "pill" ? "cursor-pointer" : ""
            }`}
            onMouseEnter={() => column.type === "pill" && setActiveCol(index)}
            onMouseLeave={() => setActiveCol(null)}
          >
            <div
              data-title-slice
              className="clip absolute inset-0 z-30 overflow-hidden pointer-events-none"
              style={{ clipPath: "inset(0% 0% 0% 100%)" }}
            >
              <div
                className="type-axis absolute left-0 right-0 h-0 pointer-events-none"
                style={{ top: "var(--hero-type-axis-y, 50%)" }}
              >
                <div
                  className={`large-title-layer absolute top-0 w-[100vw] select-none pointer-events-none transition-opacity duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    activeCol === index ? "opacity-0" : "opacity-100"
                  }`}
                  style={{
                    left: `calc(-100% * ${index})`,
                    transform: "translateY(-50%)",
                  }}
                >
                  <h1 className="w-full select-none text-center font-sans text-[clamp(80px,14.2vw,225px)] font-normal leading-[0.78] tracking-[-0.055em] text-[#25271F] lowercase md:text-[clamp(170px,14.2vw,225px)]">
                    reformer
                  </h1>
                </div>

                {column.type === "pill" && (
                  <div
                    className={`hover-title-layer absolute top-0 w-[100vw] select-none pointer-events-none transition-opacity duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                      activeCol === index ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ left: `calc(-100% * ${index})` }}
                  >
                    <div className="flex w-full items-center justify-center overflow-hidden">
                      <div className="hero-hover-marquee flex items-center select-none will-change-transform">
                        {[0, 1].map((setIndex) => (
                          <div
                            key={`hover-set-${setIndex}`}
                            className="hero-hover-marquee-set flex shrink-0 items-center"
                            aria-hidden={setIndex === 1 ? "true" : undefined}
                          >
                            {[0, 1, 2].map((wordIndex) => (
                              <span
                                key={`hover-word-${setIndex}-${wordIndex}`}
                                className="hero-hover-word select-none whitespace-nowrap font-sans text-[clamp(24px,3.6vw,56px)] font-medium leading-none tracking-[-0.035em] text-[#25271F] lowercase drop-shadow-[0_2px_12px_rgba(246,243,236,0.95)] md:text-[clamp(34px,3.6vw,56px)]"
                              >
                                {column.hoverWord}
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {column.type === "pill" && (
              <>
                <div
                  data-col-label
                  className="absolute top-8 left-4 z-20 hidden pointer-events-none md:block lg:left-6"
                >
                  <span
                    className={`text-[10px] font-medium tracking-tight transition-colors duration-300 md:text-sm ${
                      activeCol === index ? "font-bold text-[#25271F]" : "text-[#25271F]/70"
                    }`}
                  >
                    {column.label}
                  </span>
                </div>

                <div
                  className={`absolute inset-x-0 mx-auto flex w-[95%] items-center justify-center md:w-[85%] ${column.h} ${column.mt}`}
                >
                  <div
                    className="rpm-hero-pill-motion relative h-full w-full will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                    style={{
                      transform:
                        activeCol === index
                          ? "translateY(-28px) scale(1.03)"
                          : "translateY(0px) scale(1)",
                    }}
                  >
                    <div
                      data-hero-pill={index}
                      className={`relative h-full w-full overflow-hidden rounded-[999px] transition-shadow duration-500 ${
                        activeCol === index
                          ? "shadow-[0_28px_50px_-10px_rgba(37,39,31,0.3)] ring-1 ring-[#25271F]/15"
                          : "shadow-sm"
                      }`}
                    >
                      <img
                        src={column.img}
                        alt={column.hoverWord}
                        className={`h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                          activeCol === index ? "scale-110" : "scale-100"
                        }`}
                      />
                      <div
                        className={`rpm-hero-pill-overlay absolute inset-0 z-10 bg-[#F6F3EC]/30 pointer-events-none backdrop-blur-[0.5px] transition-opacity duration-300 ${
                          activeCol === index ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div
        data-final-bg
        className="absolute inset-0 z-40 overflow-hidden opacity-0 pointer-events-none"
      >
        <img
          src="/premium/studio_reveal_1788398858603.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#25271F]/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2
            data-final-text
            className="translate-y-10 text-center font-serif text-[clamp(4rem,8vw,10rem)] leading-[0.9] tracking-tighter text-[#F6F3EC] opacity-0"
          >
            A different kind
            <br />
            of studio.
          </h2>
        </div>
      </div>
    </section>
  );
}
