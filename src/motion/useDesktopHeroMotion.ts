import { useLayoutEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRACTICES } from "../content/practice";

gsap.registerPlugin(ScrollTrigger);

type PillConfig = {
  pill: HTMLElement;
  startTop: number;
  startHeight: number;
  finalTop: number;
  finalHeight: number;
  appearAt: number;
  morphAt: number;
  morphDuration: number;
};

function getPillConfig(pill: HTMLElement, index: number): PillConfig {
  const finalHeight = pill.offsetHeight || 500;
  const circleDiameter = pill.offsetWidth || 120;
  const maxTravel = Math.max(0, finalHeight - circleDiameter);

  const configs = [
    { start: 0.92, appearAt: 0.4, morphAt: 0.88, morphDuration: 0.88 },
    { start: 0.05, appearAt: 0.2, morphAt: 0.72, morphDuration: 0.9 },
    { start: 0.48, appearAt: 0.54, morphAt: 1.02, morphDuration: 0.84 },
    { start: 0.7, appearAt: 0.68, morphAt: 1.16, morphDuration: 0.86 },
  ];

  const config = configs[index] ?? {
    start: 0.2 + index * 0.2,
    appearAt: 0.2 + index * 0.16,
    morphAt: 0.7 + index * 0.16,
    morphDuration: 0.88,
  };

  return {
    pill,
    startTop: Math.round(maxTravel * config.start),
    startHeight: circleDiameter,
    finalTop: 0,
    finalHeight,
    appearAt: config.appearAt,
    morphAt: config.morphAt,
    morphDuration: config.morphDuration,
  };
}

export function useDesktopHeroMotion(heroRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const titleSlices = Array.from(
          hero.querySelectorAll<HTMLElement>("[data-title-slice]")
        );
        const heroElements = hero.querySelectorAll<HTMLElement>("[data-hero-elements]");
        const colLabels = hero.querySelectorAll<HTMLElement>("[data-col-label]");
        const pills = Array.from(hero.querySelectorAll<HTMLElement>("[data-hero-pill]"));
        const finalBg = hero.querySelector<HTMLElement>("[data-final-bg]");
        const finalText = hero.querySelector<HTMLElement>("[data-final-text]");
        const pageRoot = hero.closest(".rpm-premium") as HTMLElement | null;
        const headerLogo = pageRoot?.querySelector<HTMLElement>("[data-header-logo]");
        const headerBtn = pageRoot?.querySelector<HTMLElement>("[data-header-btn]");

        const pillConfigs = pills.map(getPillConfig);

        pillConfigs.forEach((config) => {
          gsap.set(config.pill, {
            position: "absolute",
            top: config.startTop,
            left: 0,
            right: 0,
            width: "100%",
            height: config.startHeight,
            opacity: 0,
            scale: 0.95,
            borderRadius: "999px",
          });
        });

        gsap.set(titleSlices, { clipPath: "inset(0% 0% 0% 100%)", opacity: 1 });
        gsap.set(heroElements, { opacity: 0, y: 14 });
        gsap.set(colLabels, { opacity: 0, y: -8 });

        const intro = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            pills.forEach((pill) => {
              gsap.set(pill, {
                clearProps: "position,top,left,right,width,height,scale,borderRadius",
              });
            });
            gsap.set(titleSlices, { clearProps: "clipPath" });
            gsap.set([heroElements, colLabels], { clearProps: "opacity,y" });
          },
        });

        pillConfigs.forEach((config) => {
          intro.to(
            config.pill,
            { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" },
            config.appearAt
          );
          intro.to(
            config.pill,
            {
              top: config.finalTop,
              height: config.finalHeight,
              duration: config.morphDuration,
              ease: "power3.inOut",
            },
            config.morphAt
          );
        });

        intro.to(
          [...titleSlices].reverse(),
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 0.13,
            stagger: 0.13,
            ease: "none",
          },
          1.2
        );

        intro
          .to(heroElements, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.85)
          .to(
            colLabels,
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.04 },
            1.88
          );

        const story = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "+=2000",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (self.progress > 0.01 && intro.isActive()) intro.progress(1);
            },
          },
        });

        story
          .to(titleSlices, { scale: 1.1, opacity: 0, duration: 1 }, 0)
          .to(heroElements, { opacity: 0, duration: 0.5 }, 0);

        if (pills.length === PRACTICES.length) {
          story
            .to(pills[0], { yPercent: -15, duration: 2 }, 0)
            .to(pills[1], { yPercent: 20, scale: 1.05, duration: 2 }, 0)
            .to(pills[2], { yPercent: -20, duration: 2 }, 0)
            .to(pills[3], { yPercent: 15, duration: 2 }, 0);
        }

        if (finalBg) story.to(finalBg, { opacity: 1, duration: 1 }, 1.5);
        if (finalText) story.to(finalText, { opacity: 1, y: 0, duration: 0.8 }, 2);

        if (headerLogo && headerBtn) {
          const defaultText = headerBtn.querySelector(".menu-default");
          const hoverBg = headerBtn.querySelector(".menu-bg");
          const hoverText = headerBtn.querySelector(".menu-hover");

          story
            .to(headerLogo, { color: "#F6F3EC", duration: 0.5 }, 1.5)
            .to(headerBtn, { borderColor: "#F6F3EC", duration: 0.5 }, 1.5);
          if (defaultText) story.to(defaultText, { color: "#F6F3EC", duration: 0.5 }, 1.5);
          if (hoverBg) story.to(hoverBg, { backgroundColor: "#F6F3EC", duration: 0.5 }, 1.5);
          if (hoverText) story.to(hoverText, { color: "#25271F", duration: 0.5 }, 1.5);
        }
      });

      return () => mm.revert();
    }, hero);

    return () => ctx.revert();
  }, [heroRef]);
}
