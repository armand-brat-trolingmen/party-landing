import { siteConfig } from '../../content';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import { CircularGallery } from './CircularGallery';
import styles from './FoodTrucksSection.module.css';

export function FoodTrucksSection() {
  const { ref, revealState } = useScrollReveal({ rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  const content = siteConfig.homepage.foodTrucks;

  return (
    <section
      id="food-trucks"
      className={`site-section ${styles.section}`}
      data-testid="section-food-trucks"
      aria-labelledby="food-trucks-title"
    >
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState}>
        <div className={styles.sectionBody}>
          <SectionHeading title={<span id="food-trucks-title">{content.title}</span>} />

          <div className={styles.galleryBreakout}>
            <div className={styles.galleryBand}>
              <CircularGallery items={content.items} imageFit="contain" interactiveMode="auto" eagerImageCount={3} />
            </div>
          </div>

          <div className={`${styles.copyGrid} reveal-grid`}>
            <article className={styles.copyBlock}>
              <h3 className={styles.copyTitle}>{content.storyTitle}</h3>
              <p className={styles.copyBody}>{content.storyBody}</p>
            </article>

            <article className={styles.copyBlock}>
              <h3 className={styles.copyTitle}>{content.trustTitle}</h3>
              <p className={styles.copyBody}>{content.trustBody}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
