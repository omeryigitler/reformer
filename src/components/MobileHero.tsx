import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mobileSlides = [
  {
    label: "begin",
    image: "/premium/787cc875-3817-4fdc-a070-9fe5233dbade.png",
  },
  {
    label: "build",
    image: "/premium/pill-reformer.jpg",
  },
  {
    label: "sculpt",
    image: "/premium/pill-mat.jpg",
  },
  {
    label: "private",
    image: "/premium/pill-private.jpg",
  },
];

const sceneStops = [0, 0.3, 0.55, 0.8];

export function MobileHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cardsWrap = cardsRef.current;
    if (!section || !cardsWrap) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = Array.from(
          cardsWrap.querySelectorAll<HTMLElement>("[data-mobile-hero-card]")
        );
        if (cards.length !== mobileSlides.length) return;

        const viewportWidth = () => window.innerWidth;
        const cardWidth = (card: HTMLElement) => card.offsetWidth || Math.min(window.innerWidth * 0.64, 280);
        const centerX = (card: HTMLElement) => -cardWidth(card) / 2;
        const leftOffscreenX = (card: HTMLElement) =>
          -(viewportWidth() * 0.62 + cardWidth(card));
        const rightOffscreenX = () => viewportWidth() * 0.58;

        cards.forEach((card, index) => {
          gsap.set(card, {
            x: index === 0 ? () => centerX(card) : () => leftOffscreenX(card),
            opacity: 1,
          });
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(window.innerHeight * 3.25, 2300)}`,
            scrub: 0.7,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              let nearest = 0;
              let nearestDistance = Number.POSITIVE_INFINITY;

              sceneStops.forEach((stop, index) => {
                const distance = Math.abs(self.progress - stop);
                if (distance < nearestDistance) {
                  nearestDistance = distance;
                  nearest = index;
                }
              });

              setActiveIndex(nearest);
            },
          },
        });

        scrollTriggerRef.current = timeline.scrollTrigger ?? null;

        timeline.fromTo(
          cards[0],
          { x: () => centerX(cards[0]) },
          { x: rightOffscreenX, duration: 0.82 },
          0
        );

        timeline.fromTo(
          cards[1],
          { x: () => leftOffscreenX(cards[1]) },
          { x: rightOffscreenX, duration: 1.48 },
          0.34
        );

        timeline.fromTo(
          cards[2],
          { x: () => leftOffscreenX(cards[2]) },
          { x: rightOffscreenX, duration: 1.48 },
          1.25
        );

        timeline.fromTo(
          cards[3],
          { x: () => leftOffscreenX(cards[3]) },
          { x: rightOffscreenX, duration: 1.48 },
          2.16
        );

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

  return (
    <section
      ref={sectionRef}
      className="rpm-mobile-hero md:hidden"
      aria-label="Reformer Pilates Malta classes"
    >
      <nav className="rpm-mobile-hero-tabs" aria-label="Class types">
        {mobileSlides.map((slide, index) => (
          <button
            key={slide.label}
            type="button"
            onClick={() => goToSlide(index)}
            className={activeIndex === index ? "is-active" : ""}
            aria-current={activeIndex === index ? "true" : undefined}
          >
            {slide.label}
          </button>
        ))}
      </nav>

      <div className="rpm-mobile-hero-word" aria-hidden="true">
        reformer
      </div>

      <div ref={cardsRef} className="rpm-mobile-hero-cards" aria-hidden="true">
        {mobileSlides.map((slide, index) => (
          <article
            key={slide.label}
            data-mobile-hero-card
            className={`rpm-mobile-hero-card rpm-mobile-hero-card--${index + 1}`}
          >
            <div className="rpm-mobile-hero-pill">
              <img src={slide.image} alt="" />
            </div>
          </article>
        ))}
      </div>

      <div className="rpm-mobile-hero-meta" aria-hidden="true">
        <span>{String(activeIndex + 1).padStart(2, "0")} / 04</span>
        <span>scroll ↓</span>
      </div>
    </section>
  );
}
