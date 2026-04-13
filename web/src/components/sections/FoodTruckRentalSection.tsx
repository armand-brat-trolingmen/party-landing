import { siteConfig } from '../../content';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useOrderModal } from '../cta/useOrderModal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './FoodTruckRentalSection.module.css';

export function FoodTruckRentalSection() {
  const { ref, revealState } = useScrollReveal({ rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  const { openModal } = useOrderModal();
  const content = siteConfig.homepage.foodTruckRental;

  return (
    <section
      id="food-truck-rental"
      className={`site-section ${styles.section}`}
      data-testid="section-food-truck-rental"
      aria-labelledby="food-truck-rental-title"
    >
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={styles.sectionBody}>
          <SectionHeading
            title={<span id="food-truck-rental-title">{content.title}</span>}
            description={content.description}
          />

          <div className={`${styles.photoGrid} reveal-grid`} data-testid="food-truck-rental-gallery">
            {content.items.map((item, index) => (
              <figure key={item.image} className={styles.photoFrame} data-frame-size={index === 0 ? 'tall' : 'wide'}>
                <img
                  className={styles.photo}
                  src={item.image}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  data-testid="food-truck-rental-image"
                />
              </figure>
            ))}
          </div>

          <div className={`${styles.detailsGrid} reveal-grid`}>
            <article className={styles.modelsPanel}>
              <span className={styles.kicker}>Модели</span>
              <ul className={styles.modelList}>
                {content.models.map((model) => (
                  <li key={model}>{model}</li>
                ))}
              </ul>
            </article>

            <article className={styles.copyPanel} data-panel-kind="formats">
              <h3 className={styles.copyTitle}>{content.formatsTitle}</h3>
              <p className={styles.copyBody}>{content.formats}</p>
            </article>

            <article className={styles.copyPanel}>
              <h3 className={styles.copyTitle}>{content.equipmentTitle}</h3>
              <ul className={styles.equipmentList}>
                {content.equipment.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
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
