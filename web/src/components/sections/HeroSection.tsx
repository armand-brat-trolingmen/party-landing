import { useEffect, useRef } from 'react';
import { siteContent } from '../../data/siteContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { HeroScene } from '../scene/HeroScene';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const { ref, revealState } = useScrollReveal({ rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof window === 'undefined') {
      return;
    }

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let rafId = 0;

    const sync = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = ((viewportHeight * 0.58 - rect.top) / (viewportHeight + rect.height) - 0.18) * 2.1;
      const clamped = Math.max(-1, Math.min(1, progress));
      section.style.setProperty('--hero-story-progress', clamped.toFixed(3));
      rafId = 0;
    };

    const scheduleSync = () => {
      if (rafId) {
        return;
      }

      rafId = window.requestAnimationFrame(sync);
    };

    if (prefersReducedMotion) {
      section.style.setProperty('--hero-story-progress', '0');
      return;
    }

    sync();
    window.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', scheduleSync);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener('scroll', scheduleSync);
      window.removeEventListener('resize', scheduleSync);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className={styles.hero}
      data-testid="section-hero"
      data-hero-style="poster"
      aria-label="Главный экран"
    >
      <div
        ref={ref}
        className={`site-container ${styles.container} site-reveal`}
        data-reveal-state={revealState}
        data-reveal-stagger="true"
      >
        <div className={styles.copyColumn}>
          <p className={styles.brandMark}>{siteContent.brand}</p>
          <span className={styles.accentLine} aria-hidden="true" />
          <h1 className={styles.tagline}>{siteContent.tagline}</h1>
          <p className={styles.description}>{siteContent.heroDescription}</p>
        </div>

        <div className={styles.sceneColumn}>
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
