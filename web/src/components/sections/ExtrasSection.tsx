import { extras, getOfferingPath, homePageContent, type OfferingEntity } from '../../data/catalogContent';
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

  return (
    <section id={sectionId} className="site-section" data-testid="section-extras" aria-labelledby={`${sectionId}-title`}>
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={styles.sectionBody} data-section-surface="canvas" data-section-tone="sky">
          <SectionHeading title={<span id={`${sectionId}-title`}>{title}</span>} description={description} />

          <div className={`${styles.track} reveal-grid`} data-testid="extras-track">
            {items.map((item) => (
              <article key={item.slug} className={styles.card}>
                <div className={styles.visualWrap}>
                  <OfferingVisual visual={item.visual} label={item.name} />
                </div>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.description}>{item.shortDescription}</p>
                <div className={styles.footer}>
                  <span className={styles.price}>{item.priceFrom}</span>
                  <a className={styles.link} href={getOfferingPath(item)} aria-label={`Открыть страницу услуги ${item.name}`}>
                    →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
