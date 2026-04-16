import { useEffect, useRef, useState } from 'react';
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

const MOBILE_SLIDER_QUERY = '(max-width: 720px)';
const MIN_MOBILE_EAGER_IMAGES = 4;
const MOBILE_IMAGE_LOOKAHEAD = 4;
const SERVICE_LINK_LABEL_PREFIX =
  '\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0443\u0441\u043B\u0443\u0433\u0438';
const SERVICE_LINK_TEXT = '\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435';
const SERVICES_PROGRESS_LABEL = '\u041F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0430 \u0443\u0441\u043B\u0443\u0433';

export function ServicesSection({
  items = siteConfig.services,
  sectionId = 'services',
  title = siteConfig.homepage.services.title,
  description = siteConfig.homepage.services.description,
  revealOnScroll = true,
  priorityImageCount = 3,
}: ServicesSectionProps) {
  const { ref, revealState } = useScrollReveal();
  const isMobile = useMediaQuery(MOBILE_SLIDER_QUERY);
  const { scrollerRef, progress } = useHorizontalScrollProgress(isMobile);
  const progressVisual = Math.max(progress, 16);
  const preloadCacheRef = useRef(new Set<string>());
  const baseDesktopPriorityCount = Math.max(priorityImageCount, 0);
  const baseMobileEagerCount = Math.min(items.length, Math.max(baseDesktopPriorityCount, MIN_MOBILE_EAGER_IMAGES));
  const [mobileEagerCount, setMobileEagerCount] = useState(baseMobileEagerCount);

  useEffect(() => {
    setMobileEagerCount((current) => {
      if (!isMobile) {
        return baseMobileEagerCount;
      }

      return Math.min(items.length, Math.max(current, baseMobileEagerCount));
    });
  }, [baseMobileEagerCount, isMobile, items.length]);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    const node = scrollerRef.current;
    if (!node) {
      return;
    }

    const syncEagerRange = () => {
      const slideWidth = Math.max(node.clientWidth, 1);
      const currentIndex = Math.max(0, Math.round(node.scrollLeft / slideWidth));
      const nextEagerCount = Math.min(items.length, Math.max(baseMobileEagerCount, currentIndex + MOBILE_IMAGE_LOOKAHEAD + 1));

      setMobileEagerCount((current) => (current >= nextEagerCount ? current : nextEagerCount));
    };

    syncEagerRange();
    node.addEventListener('scroll', syncEagerRange, { passive: true });
    window.addEventListener('resize', syncEagerRange);

    return () => {
      node.removeEventListener('scroll', syncEagerRange);
      window.removeEventListener('resize', syncEagerRange);
    };
  }, [baseMobileEagerCount, isMobile, items.length, scrollerRef]);

  useEffect(() => {
    const preloadCount = isMobile ? mobileEagerCount : Math.min(items.length, baseDesktopPriorityCount);

    items.slice(0, preloadCount).forEach((service) => {
      const image = service.homeCardImage;
      if (!image) {
        return;
      }

      const cacheKey = `${image.src}|${image.fallbackSrc}|${image.sizes}`;
      if (preloadCacheRef.current.has(cacheKey)) {
        return;
      }

      preloadCacheRef.current.add(cacheKey);
      const preloader = new Image();
      preloader.decoding = 'async';
      preloader.srcset = image.src;
      preloader.sizes = image.sizes;
      preloader.src = image.fallbackSrc;
    });
  }, [baseDesktopPriorityCount, isMobile, items, mobileEagerCount]);

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
              const shouldPrioritizeImage = isMobile ? index < Math.min(baseMobileEagerCount, 2) : index < baseDesktopPriorityCount;
              const shouldEagerLoadImage = isMobile ? index < mobileEagerCount : index < baseDesktopPriorityCount;

              return (
                <article key={service.slug} className={styles.card} data-testid="service-card" data-service-slug={service.slug}>
                  <a
                    className={styles.cardLink}
                    href={getOfferingPath(service)}
                    aria-label={`${SERVICE_LINK_LABEL_PREFIX} ${service.name}`}
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

                    <div className={styles.copy}>
                      <h3 className={styles.name}>{service.name}</h3>
                    </div>

                    <div className={styles.footer}>
                      <span className={styles.price}>{service.price?.display ?? service.priceFrom}</span>
                      <span className={styles.link} aria-hidden="true">
                        <span>{SERVICE_LINK_TEXT}</span>
                        <span className={styles.linkArrow}>{'\u2192'}</span>
                      </span>
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
