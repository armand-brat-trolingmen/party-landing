import { siteContent } from '../../data/siteContent';
import { HeroScene } from '../scene/HeroScene';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section
      id="hero"
      className={styles.hero}
      data-testid="section-hero"
      aria-label="Главный экран"
    >
      <div className={`site-container ${styles.container}`}>
        <div className={styles.copyColumn}>
          <p className={styles.brand}>{siteContent.brand}</p>
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
