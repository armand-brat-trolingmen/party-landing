import { siteContent } from '../../data/siteContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { HeroScene } from '../scene/HeroScene';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const { ref, revealState } = useScrollReveal({ rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  return (
    <section id="hero" className={styles.hero} data-testid="section-hero" aria-label="Главный экран">
      <div
        ref={ref}
        className={`site-container ${styles.container} site-reveal`}
        data-reveal-state={revealState}
        data-reveal-stagger="true"
      >
        <div className={styles.copyColumn}>
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
