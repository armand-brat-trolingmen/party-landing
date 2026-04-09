import { conceptLoopItems, conceptLoopSeparator } from '../../data/siteContent';
import { TextLoop } from '../ui/TextLoop';
import styles from './ConceptLoopSection.module.css';

export function ConceptLoopSection() {
  return (
    <section
      className={`site-section ${styles.section}`}
      data-testid="section-concept-loop"
      data-band-tone="cta-purple"
      aria-hidden="true"
    >
      <div
        className={styles.band}
        data-testid="concept-loop-band"
        data-band-style="soft-marquee"
        data-band-width="full-bleed"
        data-band-scale="tall"
        data-content-span="wide"
      >
        <TextLoop
          items={conceptLoopItems}
          separator={conceptLoopSeparator}
          className={styles.loop}
          direction="right"
          speed={84}
          hoverSpeed={28}
        />
      </div>
    </section>
  );
}
