import { getOfferingPath, siteConfig, type OfferingEntity } from '../../content';
import { useHorizontalScrollProgress } from '../../hooks/useHorizontalScrollProgress';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './ExtrasSection.module.css';

type ExtrasSectionProps = {
  items?: readonly OfferingEntity[];
  sectionId?: string;
  title?: string;
  description?: string;
};

export function ExtrasSection({
  items = siteConfig.extras,
  sectionId = 'extras',
  title = siteConfig.homepage.extras.title,
  description = siteConfig.homepage.extras.description,
}: ExtrasSectionProps) {
  const { ref, revealState } = useScrollReveal();
  const isMobile = useMediaQuery('(max-width: 720px)');
  const { scrollerRef, progress } = useHorizontalScrollProgress(isMobile);
  const progressVisual = Math.max(progress, 16);

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
            {items.map((item, index) => (
              <article key={item.slug} className={styles.card}>
                <a
                  className={styles.cardLink}
                  href={getOfferingPath(item)}
                  aria-label={`Открыть страницу услуги ${item.name}`}
                  data-link-appearance={isMobile ? 'card' : 'button'}
                >
                  <div
                    className={styles.visualWrap}
                    data-testid={item.visual.image ? 'extra-visual-image-wrap' : 'extra-visual-blank'}
                    aria-hidden={item.visual.image ? undefined : true}
                  >
                    {item.visual.image ? (
                      <img
                        className={styles.visualImage}
                        src={item.visual.image}
                        alt={item.visual.alt ?? item.name}
                        width={item.visual.width}
                        height={item.visual.height}
                        loading={index < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={index < 2 ? 'high' : 'low'}
                      />
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
            ))}
          </div>

          {isMobile ? (
            <div
              className={styles.sliderProgress}
              data-testid="extras-slider-progress"
              role="progressbar"
              aria-label="Прокрутка дополнительных услуг"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <span className={styles.sliderProgressFill} style={{ transform: `scaleX(${progressVisual / 100})` }} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
