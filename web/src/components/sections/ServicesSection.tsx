import { useMemo, useState } from 'react';
import { getOfferingPath, homePageContent, services as defaultServices, type OfferingEntity } from '../../data/catalogContent';
import { useHorizontalScrollProgress } from '../../hooks/useHorizontalScrollProgress';
import { useMediaQuery } from '../../hooks/useMediaQuery';
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
  const isMobile = useMediaQuery('(max-width: 720px)');
  const { scrollerRef, progress } = useHorizontalScrollProgress(isMobile);
  const progressVisual = Math.max(progress, 16);
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReveal = !isMobile && allowReveal && items.length > initialVisibleCount;

  const visibleItems = useMemo(() => {
    if (isMobile) {
      return items;
    }

    return shouldReveal && !isExpanded ? items.slice(0, initialVisibleCount) : items;
  }, [initialVisibleCount, isExpanded, isMobile, items, shouldReveal]);

  return (
    <section id={sectionId} className="site-section" data-testid="section-services" aria-labelledby={`${sectionId}-title`}>
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={styles.sectionBody}>
          <SectionHeading align="center" title={<span id={`${sectionId}-title`}>{title}</span>} description={description} />

          <div
            ref={scrollerRef}
            className={`${styles.grid} reveal-grid`}
            data-testid="services-catalog"
            data-showcase-style="premium-grid"
            data-services-expanded={isExpanded ? 'true' : 'false'}
            data-mobile-layout={isMobile ? 'slider-trio' : 'grid'}
          >
            {visibleItems.map((service) => (
              <article key={service.slug} className={styles.card} data-testid="service-card" data-service-slug={service.slug}>
                <a
                  className={styles.cardLink}
                  href={getOfferingPath(service)}
                  aria-label={`Открыть страницу услуги ${service.name}`}
                  data-link-appearance={isMobile ? 'card' : 'button'}
                >
                  <div className={styles.visualWrap}>
                    <OfferingVisual visual={service.visual} label={service.name} />
                  </div>

                  <div className={styles.copy}>
                    <h3 className={styles.name}>{service.name}</h3>
                    <p className={styles.description}>{service.shortDescription}</p>
                  </div>

                  <div className={styles.footer}>
                    <span className={styles.price}>{service.priceFrom}</span>
                    <span className={styles.link} aria-hidden="true">
                      <span>Подробнее</span>
                      <span className={styles.linkArrow}>→</span>
                    </span>
                  </div>
                </a>
              </article>
            ))}
          </div>

          {isMobile ? (
            <div
              className={styles.sliderProgress}
              data-testid="services-slider-progress"
              role="progressbar"
              aria-label="Прокрутка услуг"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <span className={styles.sliderProgressFill} style={{ transform: `scaleX(${progressVisual / 100})` }} />
            </div>
          ) : null}

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
