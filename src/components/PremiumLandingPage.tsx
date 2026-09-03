"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowDown } from "lucide-react";
import { SiteFooter } from "./SiteFooter";
import type { ManagementState, UserType } from "../types";

gsap.registerPlugin(ScrollTrigger);

const gridColumns = [
  { id: 0, type: 'empty' },
  { id: 1, type: 'empty' },
  { id: 2, type: 'pill', hoverWord: "begin", label: "BEGIN", img: "/premium/787cc875-3817-4fdc-a070-9fe5233dbade.png", h: "h-[55svh]", mt: "mt-10 md:mt-32" },
  { id: 3, type: 'pill', hoverWord: "build", label: "BUILD", img: "/premium/pill-reformer.jpg", h: "h-[70svh]", mt: "-mt-10 md:-mt-16" },
  { id: 4, type: 'pill', hoverWord: "sculpt", label: "SCULPT", img: "/premium/pill-mat.jpg", h: "h-[45svh]", mt: "mt-5 md:mt-16" },
  { id: 5, type: 'pill', hoverWord: "private", label: "PRIVATE", img: "/premium/pill-private.jpg", h: "h-[65svh]", mt: "-mt-10 md:-mt-24" },
];

type PremiumLandingPageProps = {
  managementState: ManagementState;
  loggedInUser: UserType | null;
  authModal: string | null;
  setAuthModal: (value: string | null) => void;
  onLogin: (user: UserType) => void;
  onOpenDashboard: () => void;
  onLogout: () => void;
};

const classes = [
  {
    eyebrow: "01",
    title: "BEGIN",
    subtitle: "Foundation · Control · Confidence",
    image: "/premium/class_begin_1788398731056.jpg",
  },
  {
    eyebrow: "02",
    title: "BUILD",
    subtitle: "Strength · Stability · Progression",
    image: "/premium/class_build_1788398745221.jpg",
  },
  {
    eyebrow: "03",
    title: "SCULPT",
    subtitle: "Flow · Endurance · Precision",
    image: "/premium/class_sculpt_1788398759768.jpg",
  },
  {
    eyebrow: "04",
    title: "PRIVATE",
    subtitle: "Personal · Focused · Yours",
    image: "/premium/class_private_1788398774136.jpg",
  },
];

const proofItems = [
  ["SMALL", "GROUPS"],
  ["EXPERT", "GUIDANCE"],
  ["ST JULIAN’S", "MALTA"],
];

export function PremiumLandingPage({
  managementState,
  loggedInUser,
  authModal,
  setAuthModal,
  onLogin,
  onOpenDashboard,
  onLogout,
}: PremiumLandingPageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroStoryRef = useRef<HTMLElement>(null);
  const classesRef = useRef<HTMLElement>(null);
  const [activeCol, setActiveCol] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          const heroStory = heroStoryRef.current;
          if (heroStory) {
            const titleSlices = heroStory.querySelectorAll<HTMLElement>("[data-title-slice]");
            const heroElements = heroStory.querySelectorAll<HTMLElement>("[data-hero-elements]");
            const colLabels = heroStory.querySelectorAll<HTMLElement>("[data-col-label]");
            const pills: HTMLElement[] = Array.from(heroStory.querySelectorAll<HTMLElement>("[data-hero-pill]"));
            const finalBg = heroStory.querySelector<HTMLElement>("[data-final-bg]");
            const finalText = heroStory.querySelector<HTMLElement>("[data-final-text]");
            const headerLogo = rootRef.current?.querySelector<HTMLElement>("[data-header-logo]");
            const headerBtn = rootRef.current?.querySelector<HTMLElement>("[data-header-btn]");

            // -----------------------------------------------------------------
            // ART-DIRECTED INDIVIDUAL INTRO GEOMETRY FOR EACH MEDIA CAPSULE
            // Media 1 (BUILD): begins near future top edge → grows mostly DOWNWARD
            // Media 2 (BEGIN): begins lower → top travels UPWARD while height expands
            // Media 3 (SCULPT): begins near middle → expands BOTH upward and downward
            // Media 4 (PRIVATE): begins lower-mid → travels UPWARD while expanding
            // -----------------------------------------------------------------
            interface PillConfig {
              pill: HTMLElement;
              startTop: number;
              startHeight: number;
              finalTop: number;
              finalHeight: number;
              appearAt: number;
              morphAt: number;
              morphDuration: number;
            }

            const pillConfigs: PillConfig[] = pills.map((pill: HTMLElement, idx: number) => {
              const finalH = pill.offsetHeight || 500;
              const finalW = pill.offsetWidth || 120;
              // Circle diameter strictly equals width so width === height = 100% round circle
              const circleDiameter = finalW;
              const maxTravel = Math.max(0, finalH - circleDiameter);

              if (pills.length === 4) {
                if (idx === 1) {
                  // BUILD (column index 3, tallest): circle starts near top edge -> opens DOWNWARD
                  return {
                    pill,
                    startTop: Math.round(maxTravel * 0.05),
                    startHeight: circleDiameter,
                    finalTop: 0,
                    finalHeight: finalH,
                    appearAt: 0.20,
                    morphAt: 0.72,
                    morphDuration: 0.90,
                  };
                } else if (idx === 0) {
                  // BEGIN (column index 2): circle starts lower -> opens UPWARD
                  return {
                    pill,
                    startTop: Math.round(maxTravel * 0.92),
                    startHeight: circleDiameter,
                    finalTop: 0,
                    finalHeight: finalH,
                    appearAt: 0.40,
                    morphAt: 0.88,
                    morphDuration: 0.88,
                  };
                } else if (idx === 2) {
                  // SCULPT (column index 4): circle starts in the middle -> opens in BOTH directions
                  return {
                    pill,
                    startTop: Math.round(maxTravel * 0.48),
                    startHeight: circleDiameter,
                    finalTop: 0,
                    finalHeight: finalH,
                    appearAt: 0.54,
                    morphAt: 1.02,
                    morphDuration: 0.84,
                  };
                } else {
                  // PRIVATE (column index 5): circle starts lower-mid -> opens UPWARD
                  return {
                    pill,
                    startTop: Math.round(maxTravel * 0.70),
                    startHeight: circleDiameter,
                    finalTop: 0,
                    finalHeight: finalH,
                    appearAt: 0.68,
                    morphAt: 1.16,
                    morphDuration: 0.86,
                  };
                }
              }

              // Fallback for general column counts
              return {
                pill,
                startTop: Math.round(maxTravel * (0.2 + idx * 0.2)),
                startHeight: circleDiameter,
                finalTop: 0,
                finalHeight: finalH,
                appearAt: 0.20 + idx * 0.16,
                morphAt: 0.70 + idx * 0.16,
                morphDuration: 0.88,
              };
            });

            // Initial frame setup: pure circular geometry in place before opening
            pillConfigs.forEach((cfg) => {
              gsap.set(cfg.pill, {
                position: "absolute",
                top: cfg.startTop,
                left: 0,
                right: 0,
                width: "100%",
                height: cfg.startHeight, // width === height -> exact circle
                opacity: 0,
                scale: 0.95,
                borderRadius: "999px",
              });
            });

            gsap.set(titleSlices, { clipPath: "inset(0% 0% 0% 100%)", opacity: 1 });
            gsap.set(heroElements, { opacity: 0, y: 14 });
            gsap.set(colLabels, { opacity: 0, y: -8 });

            // -----------------------------------------------------------------
            // UNANIME OPENING CASCADE TIMELINE
            // -----------------------------------------------------------------
            const introTl = gsap.timeline({
              defaults: { ease: "power3.inOut" },
              onComplete: () => {
                // Clear inline geometry styles so pills seamlessly use native responsive layout
                pills.forEach((p) => {
                  gsap.set(p, { clearProps: "position,top,left,right,width,height,scale,borderRadius" });
                });
                gsap.set(titleSlices, { clearProps: "clipPath" });
                gsap.set([heroElements, colLabels], { clearProps: "opacity,y" });
              },
            });

            // 0.00-0.20s: Quiet ivory pause

            // ~0.20s - 0.70s: Pure circles appear one by one and remain as circles
            // ~0.72s - 2.05s: Cascading individual geometric opening (circles morphing into tall capsules)
            pillConfigs.forEach((cfg) => {
              // Circle appears and remains circular
              introTl.to(
                cfg.pill,
                { opacity: 1, scale: 1, duration: 0.30, ease: "power2.out" },
                cfg.appearAt
              );

              // Circle opens up into elongated capsule
              introTl.to(
                cfg.pill,
                {
                  top: cfg.finalTop,
                  height: cfg.finalHeight,
                  duration: cfg.morphDuration,
                  ease: "power3.inOut",
                },
                cfg.morphAt
              );
            });

            // ~1.20s - 1.95s: Right-to-Left horizontal reveal of 'reformer' overlapping media morph by ~500ms
            introTl.fromTo(
              titleSlices,
              { clipPath: "inset(0% 0% 0% 100%)", opacity: 1 },
              { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.75, ease: "power4.out" },
              1.20
            );

            // ~1.85s - 2.10s: Subtle copy and metadata reveal after title has settled
            introTl.to(heroElements, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.85)
                   .to(colLabels, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.04 }, 1.88);

            // -----------------------------------------------------------------
            // SCROLL STORYLINE PARALLAX
            // -----------------------------------------------------------------
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: heroStory,
                start: "top top",
                end: "+=2000",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                  // If user begins scrolling during intro, immediately complete intro cleanly
                  if (self.progress > 0.01 && introTl && introTl.isActive()) {
                    introTl.progress(1);
                  }
                },
              },
            });

            // 1. Initial Parallax & fade out texts
            tl.to(titleSlices, { scale: 1.1, opacity: 0, duration: 1 }, 0)
              .to(heroElements, { opacity: 0, duration: 0.5 }, 0);

            if (pills && pills.length === 4) {
              tl.to(pills[0], { yPercent: -15, duration: 2 }, 0)
                .to(pills[1], { yPercent: 20, scale: 1.05, duration: 2 }, 0) 
                .to(pills[2], { yPercent: -20, duration: 2 }, 0)
                .to(pills[3], { yPercent: 15, duration: 2 }, 0);
            }

            // 2. Final Cover Image Reveal
            tl.to(finalBg, { opacity: 1, duration: 1 }, 1.5)
              .to(finalText, { opacity: 1, y: 0, duration: 0.8 }, 2);
              
            // Change header color dynamically if present
            if (headerLogo && headerBtn) {
               const defaultText = headerBtn.querySelector('.menu-default');
               const hoverBg = headerBtn.querySelector('.menu-bg');
               const hoverText = headerBtn.querySelector('.menu-hover');
               
               tl.to(headerLogo, { color: '#F6F3EC', duration: 0.5 }, 1.5)
                 .to(headerBtn, { borderColor: '#F6F3EC', duration: 0.5 }, 1.5);
                 
               if (defaultText) tl.to(defaultText, { color: '#F6F3EC', duration: 0.5 }, 1.5);
               if (hoverBg) tl.to(hoverBg, { backgroundColor: '#F6F3EC', duration: 0.5 }, 1.5);
               if (hoverText) tl.to(hoverText, { color: '#25271F', duration: 0.5 }, 1.5);
            }
          }

          const section = classesRef.current;
          if (section) {
            const track = section.querySelector<HTMLElement>("[data-class-track]");
            if (track) {
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
            }
          }
        });

        mm.add("(max-width: 767px)", () => {
          const heroStory = heroStoryRef.current;
          if (heroStory) {
            const titleSlices = heroStory.querySelectorAll<HTMLElement>("[data-title-slice]");
            const heroElements = heroStory.querySelectorAll<HTMLElement>("[data-hero-elements]");
            gsap.set(titleSlices, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });
            gsap.set(heroElements, { opacity: 1, y: 0 });
          }
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 86%",
              },
            }
          );
        });

        return () => mm.revert();
      }, rootRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const book = () => {
    if (loggedInUser) {
      onOpenDashboard();
      return;
    }
    setAuthModal("register");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsapp = `https://wa.me/${managementState.contactInfo.phone.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(
    "Hello, I would like to get information about Reformer Pilates Malta classes."
  )}`;

  return (
    <div ref={rootRef} className="rpm-premium bg-[#F6F3EC] text-[#25271F]">
      <header className="fixed inset-x-0 top-0 z-[80] px-6 pt-6 md:px-10 md:pt-8 pointer-events-none">
        <div className="mx-auto flex w-full items-start justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Reformer Pilates Malta home"
            className="pointer-events-auto transition hover:opacity-70"
          >
            <span data-header-logo className="text-xs font-semibold uppercase tracking-[0.2em] text-[#25271F]">
              Reformer Pilates Malta
            </span>
          </button>
          
          <div className="flex items-center pointer-events-auto">
            <button
              data-header-btn
              onClick={() => {
                if (loggedInUser) onOpenDashboard();
                else setAuthModal(authModal === 'login' ? null : 'login');
              }}
              className="group relative flex h-[34px] w-[84px] items-center justify-center overflow-hidden rounded-[999px] border border-[#25271F] transition-colors"
            >
              {/* Background filling up from bottom */}
              <div 
                className="menu-bg absolute inset-0 z-0 bg-[#25271F] translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-y-0" 
              />
              
              {/* Text sliding up */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full w-full overflow-hidden">
                <span className="menu-default absolute inset-0 flex items-center justify-center text-sm font-medium tracking-wide text-[#25271F] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full">
                  menu
                </span>
                <span className="menu-hover absolute inset-0 flex items-center justify-center text-sm font-medium tracking-wide text-[#F6F3EC] translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-y-0">
                  menu
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      <main>
        <section
          ref={heroStoryRef}
          className="relative h-[100svh] overflow-hidden bg-[#F6F3EC]"
          style={{ "--hero-type-axis-y": "50%" } as React.CSSProperties}
        >
          
          {/* Background Grid Lines (6 columns) */}
          <div className="absolute inset-0 grid grid-cols-6 divide-x divide-[#25271F]/10 z-0 pointer-events-none" />

          {/* Bottom Left Corner Text */}
          <div data-hero-elements className="absolute bottom-10 left-6 md:left-10 z-50 hidden md:block pointer-events-none">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] leading-relaxed text-[#25271F]">
              Controlled Movement<br/>
              Intentional Practice<br/><br/>
              <span className="text-[#25271F]/50">St Julian's · Malta</span>
            </p>
          </div>

          {/* Bottom Right Scroll Indicator */}
          <div data-hero-elements className="absolute bottom-10 right-6 md:right-10 z-50 flex flex-col items-center gap-2 pointer-events-none">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#25271F]/50">Scroll</span>
            <ArrowDown size={14} className="animate-bounce text-[#25271F]" />
          </div>

          {/* The Active Index Grid */}
          <div className="absolute inset-0 grid grid-cols-6 z-10">
            {gridColumns.map((col, i) => (
              <div
                key={col.id}
                className={`relative flex h-full w-full items-center justify-center overflow-hidden group border-r border-[#25271F]/10 last:border-0 ${
                  col.type === 'pill' ? 'cursor-pointer' : ''
                }`}
                onMouseEnter={() => {
                  if (col.type === 'pill') {
                    setActiveCol(i);
                  }
                }}
                onMouseLeave={() => setActiveCol(null)}
              >
                {/* Viewport-Aligned Global Typography Slice */}
                <div
                  data-title-slice
                  className="clip absolute inset-0 overflow-hidden pointer-events-none z-30"
                  style={{ clipPath: "inset(0% 0% 0% 100%)" }}
                >
                  <div
                    className="type-axis absolute left-0 right-0 h-0 pointer-events-none"
                    style={{ top: "var(--hero-type-axis-y, 50%)" }}
                  >
                    {/* 1. Large Title Layer */}
                    <div
                      className={`large-title-layer absolute top-0 w-[100vw] pointer-events-none select-none transition-opacity duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
                        activeCol === i ? "opacity-0" : "opacity-100"
                      }`}
                      style={{
                        left: `calc(-100% * ${i})`,
                        transform: "translateY(-50%)",
                      }}
                    >
                      <h1 className="w-full text-center font-sans text-[clamp(80px,14.2vw,225px)] md:text-[clamp(170px,14.2vw,225px)] leading-[0.78] font-normal tracking-[-0.055em] text-[#25271F] select-none lowercase">
                        reformer
                      </h1>
                    </div>

                    {/* 2. Hover Title Layer */}
                    {col.type === 'pill' && (
                      <div
                        className={`hover-title-layer absolute top-0 w-[100vw] pointer-events-none select-none transition-opacity duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                          activeCol === i ? "opacity-100" : "opacity-0"
                        }`}
                        style={{
                          left: `calc(-100% * ${i})`,
                        }}
                      >
                        <div className="w-full overflow-hidden flex items-center justify-center">
                          <div className="hero-hover-marquee flex items-center select-none will-change-transform">
                            {[0, 1].map((setIndex) => (
                              <div
                                key={`hover-set-${setIndex}`}
                                className="hero-hover-marquee-set flex items-center shrink-0"
                                aria-hidden={setIndex === 1 ? "true" : undefined}
                              >
                                {[0, 1, 2].map((wordIndex) => (
                                  <span
                                    key={`hover-word-${setIndex}-${wordIndex}`}
                                    className="hero-hover-word font-sans text-[clamp(24px,3.6vw,56px)] md:text-[clamp(34px,3.6vw,56px)] leading-none font-medium tracking-[-0.035em] text-[#25271F] lowercase select-none whitespace-nowrap drop-shadow-[0_2px_12px_rgba(246,243,236,0.95)]"
                                  >
                                    {col.hoverWord}
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

                {col.type === 'pill' && (
                  <>
                    {/* Top Label */}
                    <div data-col-label className="absolute top-8 left-4 lg:left-6 z-20 pointer-events-none hidden md:block">
                      <span className={`text-[10px] md:text-sm font-medium tracking-tight transition-colors duration-300 ${
                        activeCol === i ? "text-[#25271F] font-bold" : "text-[#25271F]/70"
                      }`}>
                        {col.label}
                      </span>
                    </div>

                    {/* Staggered Media Pill with Active Hover Lift & Scale */}
                    <div
                      className={`absolute inset-x-0 mx-auto w-[95%] md:w-[85%] flex items-center justify-center ${col.h} ${col.mt}`}
                    >
                      <div
                        className="relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform"
                        style={{
                          transform: activeCol === i ? "translateY(-28px) scale(1.03)" : "translateY(0px) scale(1)",
                        }}
                      >
                        <div
                          data-hero-pill={i}
                          className={`relative w-full h-full rounded-[999px] overflow-hidden transition-shadow duration-500 ${
                            activeCol === i
                              ? "shadow-[0_28px_50px_-10px_rgba(37,39,31,0.3)] ring-1 ring-[#25271F]/15"
                              : "shadow-sm"
                          }`}
                        >
                          <img
                            src={col.img}
                            alt={col.hoverWord}
                            className={`w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                              activeCol === i ? "scale-110" : "scale-100"
                            }`}
                          />
                          {/* Subtle overlay on hover to pop the text */}
                          <div
                            className={`absolute inset-0 z-10 bg-[#F6F3EC]/30 backdrop-blur-[0.5px] transition-opacity duration-300 pointer-events-none ${
                              activeCol === i ? "opacity-100" : "opacity-0"
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

          {/* Final Full Screen Studio Background Reveal (Triggered by Scroll) */}
          <div data-final-bg className="absolute inset-0 z-40 opacity-0 pointer-events-none overflow-hidden">
             <img src="/premium/studio_reveal_1788398858603.jpg" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-[#25271F]/50" />
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h2 data-final-text className="font-serif text-[clamp(4rem,8vw,10rem)] leading-[0.9] tracking-tighter text-[#F6F3EC] opacity-0 translate-y-10 text-center">
                  A different kind<br/>of studio.
                </h2>
             </div>
          </div>

        </section>

        <section className="bg-[#F6F3EC] px-5 py-24 md:px-10 md:py-36 lg:px-14">
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
                  Natural Mediterranean light, intentional coaching and a
                  focused Reformer practice — without the noise of a large gym.
                </p>
                <p className="text-sm leading-relaxed text-[#707263] md:text-right">
                  St Julian&apos;s · Malta
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#25271F]/12 bg-[#EEE8DD] px-5 py-16 md:px-10 md:py-20 lg:px-14">
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

        <section
          ref={classesRef}
          className="relative overflow-hidden bg-[#25271F] text-[#F6F3EC]"
        >
          <div className="px-5 pb-12 pt-24 md:hidden">
            <p className="mb-4 text-[10px] uppercase tracking-[0.32em] text-white/55">
              Find your flow
            </p>
            <h2 className="mb-12 font-serif text-6xl leading-[.9] tracking-[-0.05em]">
              CLASSES
            </h2>
            <div className="space-y-10">
              {classes.map((item) => (
                <article key={item.title}>
                  <img
                    src={item.image}
                    alt={`${item.title} Reformer class`}
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="flex items-end justify-between border-b border-white/20 py-5">
                    <div>
                      <p className="mb-2 text-[10px] tracking-[0.3em] text-white/45">
                        {item.eyebrow}
                      </p>
                      <h3 className="font-serif text-5xl tracking-[-0.04em]">
                        {item.title}
                      </h3>
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
              <p className="mb-6 text-[10px] uppercase tracking-[0.34em] text-white/55">
                Classes
              </p>
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

        <section className="bg-[#F6F3EC] px-5 py-24 md:px-10 md:py-36 lg:px-14">
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
                  Thoughtful instruction, clear progression and attention to
                  detail — so every session feels challenging, purposeful and
                  personal.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F6F3EC] px-5 py-24 md:px-10 md:py-36 lg:px-14">
          <div className="mx-auto max-w-[1500px]">
            <div data-reveal className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
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
                Start with a considered introduction to Reformer Pilates and
                discover the right pace for your practice.
              </p>
            </div>

            <button
              onClick={book}
              className="group flex w-full items-center justify-between border-y border-[#25271F]/20 py-7 text-left transition hover:px-4"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.21em]">
                Start your first session
              </span>
              <ArrowRight className="transition group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        <section className="relative min-h-[82svh] overflow-hidden bg-[#25271F] text-[#F6F3EC]">
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
              onClick={book}
              className="group mt-9 inline-flex w-fit items-center gap-4 rounded-full bg-[#F6F3EC] px-6 py-4 text-xs font-semibold uppercase tracking-[0.19em] text-[#25271F] transition hover:scale-[1.02]"
            >
              View available sessions
              <ArrowRight className="transition group-hover:translate-x-1" size={17} />
            </button>
          </div>
        </section>
      </main>

      <div className="bg-[#F6F3EC] px-4 py-8 md:px-8 md:py-12">
        <SiteFooter
          socialLinks={managementState.socialLinks}
          contactInfo={managementState.contactInfo}
        />
      </div>

      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-[70] grid h-14 w-14 place-items-center rounded-full bg-[#25271F] text-[#F6F3EC] shadow-xl transition hover:scale-105 md:bottom-7 md:right-7"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
