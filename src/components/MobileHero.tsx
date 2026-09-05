import { PRACTICES } from "../content/practice";
import { useMobileHeroMotion } from "../motion/useMobileHeroMotion";

const titleSlices = [0, 1, 2, 3, 4, 5];

export function MobileHero() {
  const { sectionRef, trackRef, activeIndex, goToSlide } = useMobileHeroMotion();

  return (
    <section
      ref={sectionRef}
      className="rpm-mobile-hero md:hidden"
      aria-label="Reformer Pilates Malta classes"
    >
      <nav className="rpm-mobile-hero-tabs" aria-label="Class types">
        {PRACTICES.map((practice, index) => (
          <button
            key={practice.key}
            type="button"
            onClick={() => goToSlide(index)}
            className={activeIndex === index ? "is-active" : ""}
            aria-current={activeIndex === index ? "true" : undefined}
          >
            {practice.key}
          </button>
        ))}
      </nav>

      <div className="rpm-mobile-title-grid" aria-hidden="true">
        {titleSlices.map((sliceIndex) => (
          <div
            key={sliceIndex}
            data-mobile-title-slice
            className="rpm-mobile-title-slice"
          >
            <div
              className="rpm-mobile-title-global"
              style={{ left: `calc(-100% * ${sliceIndex})` }}
            >
              <span>reformer</span>
            </div>
          </div>
        ))}
      </div>

      <div ref={trackRef} className="rpm-mobile-hero-track" aria-hidden="true">
        {PRACTICES.map((practice, index) => (
          <article
            key={practice.key}
            data-mobile-hero-card
            className={`rpm-mobile-hero-card rpm-mobile-hero-card--${index + 1}`}
          >
            <div className="rpm-mobile-hero-pill">
              <img
                src={practice.image}
                alt=""
                loading="eager"
                decoding="async"
                fetchPriority={index < 2 ? "high" : "auto"}
                draggable={false}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="rpm-mobile-hero-meta" aria-hidden="true">
        <span>
          {String(activeIndex + 1).padStart(2, "0")} / {String(PRACTICES.length).padStart(2, "0")}
        </span>
        <span>scroll ↓</span>
      </div>
    </section>
  );
}
