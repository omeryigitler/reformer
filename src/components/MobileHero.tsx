import { useEffect, useRef, useState } from "react";

const mobileSlides = [
  {
    label: "begin",
    image: "/premium/787cc875-3817-4fdc-a070-9fe5233dbade.png",
    offset: "34px",
  },
  {
    label: "build",
    image: "/premium/pill-reformer.jpg",
    offset: "-12px",
  },
  {
    label: "sculpt",
    image: "/premium/pill-mat.jpg",
    offset: "46px",
  },
  {
    label: "private",
    image: "/premium/pill-private.jpg",
    offset: "8px",
  },
];

export function MobileHero() {
  const reelRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;

    let raf = 0;
    const updateActive = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = reel.scrollLeft + reel.clientWidth / 2;
        const cards = Array.from(reel.querySelectorAll<HTMLElement>("[data-mobile-hero-card]"));
        if (!cards.length) return;

        let nearest = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;
        cards.forEach((card, index) => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const distance = Math.abs(cardCenter - center);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearest = index;
          }
        });
        setActiveIndex(nearest);
      });
    };

    updateActive();
    reel.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      cancelAnimationFrame(raf);
      reel.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  return (
    <section className="rpm-mobile-hero md:hidden" aria-label="Reformer Pilates Malta classes">
      <div className="rpm-mobile-hero-rail" aria-hidden="true" />
      <div className="rpm-mobile-hero-word" aria-hidden="true">reformer</div>

      <div ref={reelRef} className="rpm-mobile-hero-reel">
        {mobileSlides.map((slide, index) => (
          <article
            key={slide.label}
            data-mobile-hero-card
            className="rpm-mobile-hero-card"
            style={{ "--mobile-card-offset": slide.offset } as React.CSSProperties}
          >
            <span className="rpm-mobile-hero-label">{slide.label}</span>
            <div className="rpm-mobile-hero-pill">
              <img src={slide.image} alt={`${slide.label} reformer pilates`} />
            </div>
          </article>
        ))}
      </div>

      <div className="rpm-mobile-hero-meta" aria-hidden="true">
        <span>{String(activeIndex + 1).padStart(2, "0")} / 04</span>
        <span>swipe →</span>
      </div>
    </section>
  );
}
