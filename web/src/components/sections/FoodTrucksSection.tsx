import { siteConfig } from '../../content';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useOrderModal } from '../cta/useOrderModal';
import { SectionHeading } from '../ui/SectionHeading';
import { CircularGallery } from './CircularGallery';
import styles from './FoodTrucksSection.module.css';

export function FoodTrucksSection() {
  const { ref, revealState } = useScrollReveal({ rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  const { openModal } = useOrderModal();
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
              <CircularGallery items={content.items} />
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

          <div className={`${styles.offerBand} reveal-grid`}>
            <div className={styles.pricing}>
              {content.pricing.map((priceLine) => (
                <p key={priceLine} className={styles.priceLine}>
                  {priceLine}
                </p>
              ))}
            </div>

            <p className={styles.terms}>{content.terms}</p>

            <button type="button" className={styles.ctaButton} onClick={openModal}>
              {content.ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
