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

const MOBILE_SLIDER_QUERY = '(max-width: 720px) and (pointer: coarse)';
const SERVICE_LINK_TEXT = '\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435';
const SERVICES_PROGRESS_LABEL = '\u041F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0430 \u0443\u0441\u043B\u0443\u0433';

export function ServicesSection({
  items = siteConfig.services,
  sectionId = 'services',
  title = siteConfig.homepage.services.title,
  description = siteConfig.homepage.services.description,
  revealOnScroll = true,
  priorityImageCount = items.length,
}: ServicesSectionProps) {
  const { ref, revealState } = useScrollReveal();
  // Keep the horizontal slider for touch phones only so narrow laptops stay on the desktop/tablet grid.
  const isMobile = useMediaQuery(MOBILE_SLIDER_QUERY);
  const { scrollerRef, progress } = useHorizontalScrollProgress(isMobile);
  const progressVisual = Math.max(progress, 16);
  const baseDesktopPriorityCount = Math.min(items.length, Math.max(priorityImageCount, 0));

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
            data-mobile-layout={isMobile ? 'slider-single' : 'grid'}
          >
            {items.map((service, index) => {
              const shouldPrioritizeImage = isMobile ? index < 2 : index < baseDesktopPriorityCount;
              const shouldEagerLoadImage = isMobile ? true : index < baseDesktopPriorityCount;
              const cardDescription = service.cardDescription ?? service.shortDescription;

              return (
                <article key={service.slug} className={styles.card} data-testid="service-card" data-service-slug={service.slug}>
                  <a className={styles.cardLink} href={getOfferingPath(service)}>
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
                            fetchPriority={shouldPrioritizeImage ? 'high' : shouldEagerLoadImage ? 'auto' : 'low'}
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

                    <div className={styles.meta} data-testid="service-card-meta">
                      <div className={styles.copy}>
                        <h3 className={styles.name}>{service.name}</h3>
                        <p className={styles.cardDescription} data-testid="service-card-description">
                          {cardDescription}
                        </p>
                      </div>

                      <div className={styles.footer}>
                        <span className={styles.price}>{service.price?.display ?? service.priceFrom}</span>
                        <span className={styles.link} aria-hidden="true">
                          <span>{SERVICE_LINK_TEXT}</span>
                          <span className={styles.linkArrow}>{'\u2192'}</span>
                        </span>
                      </div>
                    </div>
                  </a>
                </article>
              );
            })}
          </div>

          <div
            className={styles.sliderProgress}
            data-testid="services-slider-progress"
            role="progressbar"
            aria-label={SERVICES_PROGRESS_LABEL}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span className={styles.sliderProgressFill} style={{ transform: `scaleX(${progressVisual / 100})` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
