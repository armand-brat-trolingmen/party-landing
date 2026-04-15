import type { CSSProperties } from 'react';
import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import { getOfferingPath, siteConfig, type OfferingEntity } from '../../content';
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
  revealOnScroll?: boolean;
  priorityImageCount?: number;
};

const COLLAPSE_ANIMATION_MS = 280;

export function ServicesSection({
  items = siteConfig.services,
  sectionId = 'services',
  title = siteConfig.homepage.services.title,
  description = siteConfig.homepage.services.description,
  initialVisibleCount = siteConfig.homepage.services.initialVisibleCount,
  allowReveal = true,
  revealOnScroll = true,
  priorityImageCount = 3,
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
      startTransition(() => {
        setIsExpanded(true);
        setIsCollapsing(false);
      });
      return;
    }

    startTransition(() => {
      setIsCollapsing(true);
    });
    collapseTimerRef.current = window.setTimeout(() => {
      startTransition(() => {
        setIsExpanded(false);
        setIsCollapsing(false);
      });
      collapseTimerRef.current = null;
    }, COLLAPSE_ANIMATION_MS);
  }

  return (
    <section id={sectionId} className="site-section" data-testid="section-services" aria-labelledby={`${sectionId}-title`}>
      <div
        ref={ref}
        className={`site-container${revealOnScroll ? ' site-reveal' : ''}`}
        data-reveal-state={revealOnScroll ? revealState : undefined}
        data-reveal-stagger={revealOnScroll ? 'true' : undefined}
      >
        <div className={styles.sectionBody}>
          <SectionHeading align="center" title={<span id={`${sectionId}-title`}>{title}</span>} description={description} />

          <div
            ref={scrollerRef}
            className={`${styles.grid} reveal-grid`}
            data-testid="services-catalog"
            data-showcase-style="premium-grid"
            data-services-expanded={isExpanded ? 'true' : 'false'}
            data-services-collapsing={isCollapsing ? 'true' : 'false'}
            data-mobile-layout={isMobile ? 'slider-single' : 'grid'}
          >
            {visibleItems.map((service, index) => {
              const isExtraCard = index >= initialVisibleCount;
              const isRevealEnter = shouldReveal && isExpanded && !isCollapsing && isExtraCard;
              const isRevealExit = shouldReveal && isCollapsing && isExtraCard;
              const shouldPrioritizeImage = index < priorityImageCount;
              const shouldEagerLoadImage = shouldPrioritizeImage;
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
                    <div className={styles.visualWrap} data-image-fit={service.homeCardImage?.objectFit} aria-hidden="true">
                      {service.homeCardImage ? (
                        <picture className={styles.visualPicture}>
                          <source
                            data-testid="service-card-media-source-webp"
                            type={service.homeCardImage.sourceType ?? 'image/webp'}
                            srcSet={service.homeCardImage.src}
                            sizes={service.homeCardImage.sizes}
                          />
                          <img
                            className={styles.visualImage}
                            data-testid="service-card-media-image"
                            data-image-fit={service.homeCardImage.objectFit}
                            data-service-image-slug={service.slug}
                            src={service.homeCardImage.fallbackSrc}
                            alt=""
                            loading={shouldEagerLoadImage ? 'eager' : 'lazy'}
                            decoding="async"
                            fetchPriority={shouldPrioritizeImage ? 'high' : 'low'}
                            width={service.homeCardImage.width}
                            height={service.homeCardImage.height}
                            sizes={service.homeCardImage.sizes}
                            style={{ objectFit: service.homeCardImage.objectFit, objectPosition: service.homeCardImage.objectPosition }}
                          />
                        </picture>
                      ) : (
                        <div className={styles.visualFallback} data-testid="service-card-media-placeholder" />
                      )}
                    </div>

                    <div className={styles.copy}>
                      <h3 className={styles.name}>{service.name}</h3>
                    </div>

                    <div className={styles.footer}>
                      <span className={styles.price}>{service.price?.display ?? service.priceFrom}</span>
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
                {isExpanded ? siteConfig.homepage.services.collapseLabel : siteConfig.homepage.services.revealLabel}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
