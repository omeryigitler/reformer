import { useEffect, useRef, useState } from "react";

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

const reformerWords = [0, 1, 2, 3];

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

  const goToSlide = (index: number) => {
    const reel = reelRef.current;
    if (!reel) return;
    const cards = Array.from(reel.querySelectorAll<HTMLElement>("[data-mobile-hero-card]"));
    const card = cards[index];
    if (!card) return;

    const target = card.offsetLeft - (reel.clientWidth - card.offsetWidth) / 2;
    reel.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <section className="rpm-mobile-hero md:hidden" aria-label="Reformer Pilates Malta classes">
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

      <div className="rpm-mobile-reformer-marquee" aria-hidden="true">
        <div className="rpm-mobile-reformer-track">
          {[0, 1].map((groupIndex) => (
            <div key={groupIndex} className="rpm-mobile-reformer-group">
              {reformerWords.map((wordIndex) => (
                <span key={`${groupIndex}-${wordIndex}`}>reformer</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div ref={reelRef} className="rpm-mobile-hero-reel">
        {mobileSlides.map((slide) => (
          <article key={slide.label} data-mobile-hero-card className="rpm-mobile-hero-card">
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
