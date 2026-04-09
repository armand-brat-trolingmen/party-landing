import { extras, getOfferingPath, homePageContent, type OfferingEntity } from '../../data/catalogContent';
import { useHorizontalScrollProgress } from '../../hooks/useHorizontalScrollProgress';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import { OfferingVisual } from '../ui/OfferingVisual';
import styles from './ExtrasSection.module.css';

type ExtrasSectionProps = {
  items?: readonly OfferingEntity[];
  sectionId?: string;
  title?: string;
  description?: string;
};

export function ExtrasSection({
  items = extras,
  sectionId = 'extras',
  title = homePageContent.extras.title,
  description = homePageContent.extras.description,
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
            data-mobile-layout={isMobile ? 'slider-single' : 'grid'}
          >
            {items.map((item) => (
              <article key={item.slug} className={styles.card}>
                <a
                  className={styles.cardLink}
                  href={getOfferingPath(item)}
                  aria-label={`Открыть страницу услуги ${item.name}`}
                  data-link-appearance={isMobile ? 'card' : 'button'}
                >
                  <div className={styles.visualWrap}>
                    <OfferingVisual visual={item.visual} label={item.name} />
                  </div>
                  <div className={styles.copy}>
                    <h3 className={styles.name}>{item.name}</h3>
                    <p className={styles.description}>{item.shortDescription}</p>
                  </div>
                  <div className={styles.footer}>
                    <span className={styles.price}>{item.priceFrom}</span>
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
