import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRACTICES } from "../content/practice";

gsap.registerPlugin(ScrollTrigger);

const sceneStops = [0.02, 0.18, 0.36, 0.55];
const titleScatter = [-82, 64, -112, 88, -70, 106];

export function useMobileHeroMotion() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = Array.from(
          track.querySelectorAll<HTMLElement>("[data-mobile-hero-card]")
        );
        const slices = Array.from(
          section.querySelectorAll<HTMLElement>("[data-mobile-title-slice]")
        );

        if (cards.length !== PRACTICES.length || !slices.length) return;

        const horizontalTravel = () => {
          const lastCard = cards[cards.length - 1];
          const exitBuffer = window.innerWidth * 0.08;
          return Math.max(0, lastCard.offsetLeft + lastCard.offsetWidth + exitBuffer);
        };

        gsap.set(track, { x: 0 });
        gsap.set(slices, { yPercent: 0, opacity: 1, scale: 1 });

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
            onRefresh: updateActiveCard,
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

        timeline.to(
          slices,
          {
            yPercent: (index) => titleScatter[index] ?? 0,
            scale: (index) => (index % 2 === 0 ? 1.025 : 0.985),
            duration: 1.15,
            stagger: 0.025,
            ease: "power2.inOut",
          },
          3.82
        );

        timeline.to(
          slices,
          {
            opacity: 0,
            duration: 0.35,
            stagger: 0.018,
            ease: "power1.out",
          },
          4.68
        );

        updateActiveCard();

        return () => {
          scrollTriggerRef.current = null;
        };
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: reduce)", () => {
        setActiveIndex(0);
      });

      return () => mm.revert();
    }, section);

    return () => {
      scrollTriggerRef.current = null;
      ctx.revert();
    };
  }, []);

  const goToSlide = (index: number) => {
    const trigger = scrollTriggerRef.current;
    if (!trigger) return;

    const targetProgress = sceneStops[index] ?? 0;
    const targetScroll = trigger.start + (trigger.end - trigger.start) * targetProgress;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return { sectionRef, trackRef, activeIndex, goToSlide };
}
