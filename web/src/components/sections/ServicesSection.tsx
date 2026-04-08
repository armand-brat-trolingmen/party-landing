import { useMemo, useState } from 'react';
import { getOfferingPath, homePageContent, services as defaultServices, type OfferingEntity } from '../../data/catalogContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import { OfferingVisual } from '../ui/OfferingVisual';
import styles from './ServicesSection.module.css';

type ServicesSectionProps = {
  items?: readonly OfferingEntity[];
  sectionId?: string;
  title?: string;
  description?: string;
  initialVisibleCount?: number;
  allowReveal?: boolean;
};

export function ServicesSection({
  items = defaultServices,
  sectionId = 'services',
  title = homePageContent.services.title,
  description = homePageContent.services.description,
  initialVisibleCount = homePageContent.services.initialVisibleCount,
  allowReveal = true,
}: ServicesSectionProps) {
  const { ref, revealState } = useScrollReveal();
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReveal = allowReveal && items.length > initialVisibleCount;

  const visibleItems = useMemo(
    () => (shouldReveal && !isExpanded ? items.slice(0, initialVisibleCount) : items),
    [initialVisibleCount, isExpanded, items, shouldReveal],
  );

  return (
    <section id={sectionId} className="site-section" data-testid="section-services" aria-labelledby={`${sectionId}-title`}>
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={`${styles.frame} site-panel-glow`} data-section-surface="cards" data-section-tone="lemon">
          <SectionHeading align="center" title={<span id={`${sectionId}-title`}>{title}</span>} description={description} />

          <div
            className={`${styles.grid} reveal-grid`}
            data-testid="services-catalog"
            data-services-expanded={isExpanded ? 'true' : 'false'}
          >
            {visibleItems.map((service) => (
              <article key={service.slug} className={styles.card} data-testid="service-card" data-service-slug={service.slug}>
                <div className={styles.visualWrap}>
                  <OfferingVisual visual={service.visual} label={service.name} />
                </div>

                <div className={styles.copy}>
                  <h3 className={styles.name}>{service.name}</h3>
                  <p className={styles.description}>{service.shortDescription}</p>
                </div>

                <div className={styles.footer}>
                  <span className={styles.price}>{service.priceFrom}</span>
                  <a className={styles.link} href={getOfferingPath(service)} aria-label={`Открыть страницу услуги ${service.name}`}>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          {shouldReveal ? (
            <div className={styles.revealWrap}>
              <button
                type="button"
                className={styles.revealButton}
                data-testid="services-reveal-button"
                onClick={() => setIsExpanded((current) => !current)}
              >
                {isExpanded ? homePageContent.services.collapseLabel : homePageContent.services.revealLabel}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
