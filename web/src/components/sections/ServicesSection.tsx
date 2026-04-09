import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getOfferingPath, homePageContent, services as defaultServices, type OfferingEntity } from '../../data/catalogContent';
import { useHorizontalScrollProgress } from '../../hooks/useHorizontalScrollProgress';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './ServicesSection.module.css';

type ServicesSectionProps = {
  items?: readonly OfferingEntity[];
  sectionId?: string;
  title?: string;
  description?: string;
  initialVisibleCount?: number;
  allowReveal?: boolean;
};

const COLLAPSE_ANIMATION_MS = 280;

function formatServiceCardPrice(priceFrom: string) {
  return priceFrom.includes('₽') ? priceFrom : `${priceFrom} ₽`;
}

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
  const [isCollapsing, setIsCollapsing] = useState(false);
  const collapseTimerRef = useRef<number | null>(null);
  const shouldReveal = !isMobile && allowReveal && items.length > initialVisibleCount;

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current !== null) {
        window.clearTimeout(collapseTimerRef.current);
      }
    };
  }, []);

  const visibleItems = useMemo(() => {
    if (isMobile) {
      return items;
    }

    return shouldReveal && !isExpanded && !isCollapsing ? items.slice(0, initialVisibleCount) : items;
  }, [initialVisibleCount, isCollapsing, isExpanded, isMobile, items, shouldReveal]);

  function handleRevealToggle() {
    if (!shouldReveal) {
      return;
    }

    if (collapseTimerRef.current !== null) {
      window.clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }

    if (!isExpanded) {
      setIsExpanded(true);
      setIsCollapsing(false);
      return;
    }

    setIsCollapsing(true);
    collapseTimerRef.current = window.setTimeout(() => {
      setIsExpanded(false);
      setIsCollapsing(false);
      collapseTimerRef.current = null;
    }, COLLAPSE_ANIMATION_MS);
  }

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
            data-services-collapsing={isCollapsing ? 'true' : 'false'}
            data-mobile-layout={isMobile ? 'slider-trio' : 'grid'}
          >
            {visibleItems.map((service, index) => {
              const isExtraCard = index >= initialVisibleCount;
              const isRevealEnter = shouldReveal && isExpanded && !isCollapsing && isExtraCard;
              const isRevealExit = shouldReveal && isCollapsing && isExtraCard;
              const revealStyle =
                isRevealEnter || isRevealExit
                  ? ({
                      ['--service-reveal-order' as string]: index - initialVisibleCount,
                    } as CSSProperties)
                  : undefined;

              return (
                <article
                  key={service.slug}
                  className={styles.card}
                  data-testid="service-card"
                  data-service-slug={service.slug}
                  data-reveal-enter={isRevealEnter ? 'true' : undefined}
                  data-reveal-exit={isRevealExit ? 'true' : undefined}
                  style={revealStyle}
                >
                  <a
                    className={styles.cardLink}
                    href={getOfferingPath(service)}
                    aria-label={`Открыть страницу услуги ${service.name}`}
                    data-link-appearance={isMobile ? 'card' : 'button'}
                  >
                    <div className={styles.visualWrap} aria-hidden="true">
                      {service.homeCardImage ? (
                        <img
                          className={styles.visualImage}
                          data-testid="service-card-media-image"
                          src={service.homeCardImage.src}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          style={{ objectPosition: service.homeCardImage.objectPosition }}
                        />
                      ) : (
                        <div className={styles.visualFallback} data-testid="service-card-media-placeholder" />
                      )}
                    </div>

                    <div className={styles.copy}>
                      <h3 className={styles.name}>{service.name}</h3>
                    </div>

                    <div className={styles.footer}>
                      <span className={styles.price}>{formatServiceCardPrice(service.priceFrom)}</span>
                      <span className={styles.link} aria-hidden="true">
                        <span>Подробнее</span>
                        <span className={styles.linkArrow}>→</span>
                      </span>
                    </div>
                  </a>
                </article>
              );
            })}
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
                onClick={handleRevealToggle}
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
