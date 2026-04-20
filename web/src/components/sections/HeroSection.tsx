import { Fragment } from 'react';
import { siteConfig } from '../../content';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { HeroPosterCarousel } from './HeroPosterCarousel';
import styles from './HeroSection.module.css';

function scrollToSection(targetId: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  const behavior = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  target.scrollIntoView({ behavior, block: 'start' });
}

export function HeroSection() {
  const { ref, revealState } = useScrollReveal({ rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  const { hero } = siteConfig.homepage;

  return (
    <section id="hero" className={styles.hero} data-testid="section-hero" data-hero-style="editorial-poster" aria-label={hero.title}>
      <div
        ref={ref}
        className={`site-container ${styles.container} site-reveal`}
        data-reveal-state={revealState}
        data-reveal-stagger="true"
      >
        <div className={styles.copyColumn}>
          <h1 className={styles.tagline} aria-label={hero.title}>
            {hero.titleLines.map((line, index) => (
              <Fragment key={line}>
                <span className={styles.taglineLine} data-testid={`hero-title-line-${index + 1}`}>
                  {line}
                  {index < hero.titleLines.length - 1 ? ' ' : null}
                </span>
              </Fragment>
            ))}
          </h1>

          <p className={styles.lead}>{hero.description}</p>

          <div className={styles.actions}>
            <button type="button" className={styles.primaryAction} onClick={() => scrollToSection('cta')}>
              {hero.primaryActionLabel}
            </button>
            <button type="button" className={styles.secondaryAction} onClick={() => scrollToSection('services')}>
              {hero.secondaryActionLabel}
            </button>
          </div>
        </div>

        <div className={styles.posterColumn}>
          <HeroPosterCarousel slides={hero.slides} />
        </div>
      </div>
    </section>
  );
}
