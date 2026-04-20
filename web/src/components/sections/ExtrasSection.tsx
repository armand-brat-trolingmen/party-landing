import { getOfferingPath, siteConfig, type OfferingEntity } from '../../content';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './ExtrasSection.module.css';

type ExtrasSectionProps = {
  items?: readonly OfferingEntity[];
  sectionId?: string;
  title?: string;
  description?: string;
  priorityImageCount?: number;
};

export function ExtrasSection({
  items = siteConfig.extras,
  sectionId = 'extras',
  title = siteConfig.homepage.extras.title,
  description = siteConfig.homepage.extras.description,
  priorityImageCount = 1,
}: ExtrasSectionProps) {
  const { ref, revealState } = useScrollReveal();

  return (
    <section id={sectionId} className="site-section" data-testid="section-extras" aria-labelledby={`${sectionId}-title`}>
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={styles.sectionBody}>
          <SectionHeading title={<span id={`${sectionId}-title`}>{title}</span>} description={description} />

          <div
            className={`${styles.track} reveal-grid`}
            data-testid="extras-track"
            data-extras-style="continuation-grid"
            data-mobile-layout="grid"
          >
            {items.map((item, index) => {
              const shouldPrioritizeImage = index < priorityImageCount;
              const imageLoading = shouldPrioritizeImage ? 'eager' : 'lazy';
              const imageFetchPriority = shouldPrioritizeImage ? 'high' : 'low';

              return (
              <article key={item.slug} className={styles.card}>
                <a
                  className={styles.cardLink}
                  href={getOfferingPath(item)}
                  data-link-appearance="button"
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
                    <h3 className={styles.name}>{item.name}</h3>
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
