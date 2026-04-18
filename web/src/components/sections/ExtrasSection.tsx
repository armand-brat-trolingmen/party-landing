import { getOfferingPath, siteConfig, type OfferingEntity } from '../../content';
import { useHorizontalScrollProgress } from '../../hooks/useHorizontalScrollProgress';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './ExtrasSection.module.css';

const MOBILE_SLIDER_QUERY = '(max-width: 720px) and (pointer: coarse)';

const EXTRA_CARD_NAME_LINES: Partial<Record<string, readonly string[]>> = {
  'branded-cart': ['Брендирование', 'тележки для', 'кейтеринга'],
  'equipment-rental': ['Аренда', 'оборудования'],
  'cart-rental': ['Аренда', 'тележек'],
};

type ExtrasSectionProps = {
  items?: readonly OfferingEntity[];
  sectionId?: string;
  title?: string;
  description?: string;
  priorityImageCount?: number;
};

function getExtraCardNameLines(item: OfferingEntity) {
  return EXTRA_CARD_NAME_LINES[item.slug] ?? [item.name];
}

export function ExtrasSection({
  items = siteConfig.extras,
  sectionId = 'extras',
  title = siteConfig.homepage.extras.title,
  description = siteConfig.homepage.extras.description,
  priorityImageCount = 0,
}: ExtrasSectionProps) {
  const { ref, revealState } = useScrollReveal();
  // Match the services section: keep the slider for touch phones only so narrow desktops stay on the grid.
  const isMobile = useMediaQuery(MOBILE_SLIDER_QUERY);
  const { scrollerRef } = useHorizontalScrollProgress(isMobile);

  return (
    <section id={sectionId} className="site-section" data-testid="section-extras" aria-labelledby={`${sectionId}-title`}>
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={styles.sectionBody}>
          <SectionHeading title={<span id={`${sectionId}-title`}>{title}</span>} description={description} />

          <div
            ref={scrollerRef}
            className={`${styles.track} reveal-grid`}
            data-testid="extras-track"
            data-extras-style="continuation-grid"
            data-mobile-layout={isMobile ? 'slider-compact' : 'grid'}
          >
            {items.map((item, index) => {
              const shouldPrioritizeImage = index < priorityImageCount;
              const imageLoading = shouldPrioritizeImage ? 'eager' : 'lazy';
              const imageFetchPriority = shouldPrioritizeImage ? 'high' : 'low';
              const nameLines = getExtraCardNameLines(item);

              return (
              <article key={item.slug} className={styles.card}>
                <a
                  className={styles.cardLink}
                  href={getOfferingPath(item)}
                  data-link-appearance={isMobile ? 'card' : 'button'}
                >
                  <div
                    className={styles.visualWrap}
                    data-testid={item.visual.image ? 'extra-visual-image-wrap' : 'extra-visual-blank'}
                    aria-hidden={item.visual.image ? undefined : true}
                  >
                    {item.visual.image ? (
                      <picture className={styles.visualPicture}>
                        {item.visual.imageWebpSrcSet ? (
                          <source
                            data-testid="extra-visual-source-webp"
                            type="image/webp"
                            srcSet={item.visual.imageWebpSrcSet}
                            sizes={item.visual.sizes}
                          />
                        ) : null}
                        <img
                          className={styles.visualImage}
                          data-testid="extra-visual-image"
                          src={item.visual.image}
                          alt={item.visual.alt ?? item.name}
                          width={item.visual.width}
                          height={item.visual.height}
                          loading={imageLoading}
                          decoding="async"
                          fetchPriority={imageFetchPriority}
                        />
                      </picture>
                    ) : null}
                  </div>
                  <div className={styles.copy}>
                    <h3 className={styles.name}>
                      {nameLines.map((line) => (
                        <span key={line} className={styles.nameLine} data-testid="extra-card-title-line">
                          {line}
                        </span>
                      ))}
                    </h3>
                    <p className={styles.description}>{item.shortDescription}</p>
                  </div>
                  <div className={styles.footer}>
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
        </div>
      </div>
    </section>
  );
}
