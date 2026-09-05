import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRACTICES } from "../content/practice";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const sceneStops = [0.02, 0.18, 0.36, 0.55];
const titleScatter = [-82, 64, -112, 88, -70, 106];

export function useMobileHeroMotion() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const titleGrid = section.querySelector<HTMLElement>(".rpm-mobile-title-grid");
    const titleSlices = Array.from(
      section.querySelectorAll<HTMLElement>("[data-mobile-title-slice]")
    );
    const titleGlobals = Array.from(
      section.querySelectorAll<HTMLElement>("[data-mobile-title-global]")
    );

    /* Each slice contains a full copy of the word. Percentage offsets were
       previously calculated from each fractional grid track, so browser
       rounding could shift neighbouring copies by a sub-pixel/one pixel at a
       vertical seam (most visible through the first "e"). Measure the actual
       rendered grid boundaries instead and anchor every copy to one identical
       full-width coordinate system. */
    const syncTitleGeometry = () => {
      if (!titleGrid || titleSlices.length !== titleGlobals.length) return;
      const fullWidth = titleGrid.clientWidth;

      titleSlices.forEach((slice, index) => {
        const globalTitle = titleGlobals[index];
        if (!globalTitle) return;
        globalTitle.style.left = `${-slice.offsetLeft}px`;
        globalTitle.style.width = `${fullWidth}px`;
      });
    };

    syncTitleGeometry();

    const titleResizeObserver =
      typeof ResizeObserver !== "undefined" && titleGrid
        ? new ResizeObserver(syncTitleGeometry)
        : null;
    if (titleGrid) titleResizeObserver?.observe(titleGrid);

    /* Only the first two cards compete for the initial render. Warm the later
       cards shortly after first paint at low priority so fast scrolling still
       reaches already-cached media without delaying the page shell. */
    const warmTimer = window.setTimeout(() => {
      PRACTICES.slice(2).forEach((practice) => {
        const image = new Image();
        image.decoding = "async";
        image.fetchPriority = "low";
        image.src = practice.image;
      });
    }, 900);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = Array.from(
          track.querySelectorAll<HTMLElement>("[data-mobile-hero-card]")
        );
        const slices = titleSlices;
        const tabs = section.querySelector<HTMLElement>(".rpm-mobile-hero-tabs");

        if (cards.length !== PRACTICES.length || !slices.length || !tabs) return;
        cardsRef.current = cards;

        const horizontalTravel = () => {
          const lastCard = cards.at(-1);
          if (!lastCard) return 0;
          const exitBuffer = window.innerWidth * 0.08;
          return Math.max(0, lastCard.offsetLeft + lastCard.offsetWidth + exitBuffer);
        };

        gsap.set(track, { x: 0 });
        gsap.set(tabs, { y: 0, autoAlpha: 1 });
        gsap.set(slices, { yPercent: 0, opacity: 1, scale: 1 });
        syncTitleGeometry();

        const updateActiveCard = () => {
          const viewportCenter = window.innerWidth / 2;
          let nearest = 0;
          let nearestDistance = Number.POSITIVE_INFINITY;

          cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const distance = Math.abs(cardCenter - viewportCenter);
            if (distance < nearestDistance) {
              nearestDistance = distance;
              nearest = index;
            }
          });

          setActiveIndex(nearest);
        };

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(window.innerHeight * 4.8, 3400)}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: updateActiveCard,
            onRefresh: () => {
              syncTitleGeometry();
              updateActiveCard();
            },
          },
        });

        scrollTriggerRef.current = timeline.scrollTrigger ?? null;

        timeline.to(
          track,
          {
            x: () => -horizontalTravel(),
            duration: 3.7,
            ease: "none",
          },
          0
        );

        /* The four labels leave only after the last capsule is fully offscreen.
           The title scatter starts after this rail has finished leaving. */
        timeline.to(
          tabs,
          {
            y: -12,
            autoAlpha: 0,
            duration: 0.24,
            ease: "power1.out",
          },
          3.76
        );

        timeline.to(
          slices,
          {
            yPercent: (index) => titleScatter[index] ?? 0,
            scale: (index) => (index % 2 === 0 ? 1.025 : 0.985),
            duration: 1.15,
            stagger: 0.025,
            ease: "power2.inOut",
          },
          4.08
        );

        timeline.to(
          slices,
          {
            opacity: 0,
            duration: 0.35,
            stagger: 0.018,
            ease: "power1.out",
          },
          4.94
        );

        updateActiveCard();

        return () => {
          scrollTriggerRef.current = null;
        };
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: reduce)", () => {
        cardsRef.current = Array.from(
          track.querySelectorAll<HTMLElement>("[data-mobile-hero-card]")
        );
        gsap.set(track, { x: 0 });
        syncTitleGeometry();
        setActiveIndex(0);
      });

      return () => mm.revert();
    }, section);

    return () => {
      window.clearTimeout(warmTimer);
      titleResizeObserver?.disconnect();
      cardsRef.current = [];
      scrollTriggerRef.current = null;
      ctx.revert();
    };
  }, []);

  const goToSlide = (index: number) => {
    const trigger = scrollTriggerRef.current;
    if (trigger) {
      const targetProgress = sceneStops[index] ?? 0;
      const targetScroll = trigger.start + (trigger.end - trigger.start) * targetProgress;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
      return;
    }

    const track = trackRef.current;
    const card = cardsRef.current[index];
    if (!track || !card) return;

    const desiredTravel = card.offsetLeft + card.offsetWidth / 2 - window.innerWidth / 2;
    const maxTravel = Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.set(track, { x: -Math.min(Math.max(0, desiredTravel), maxTravel) });
    setActiveIndex(index);
  };

  return { sectionRef, trackRef, activeIndex, goToSlide };
}
