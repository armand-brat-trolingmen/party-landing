import { homePageContent, moments } from '../../data/catalogContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './ReviewsSection.module.css';

export function ReviewsSection() {
  const { ref, revealState } = useScrollReveal();
  const featuredMoments = moments.slice(0, 3);

  return (
    <section id="moments" className="site-section" data-testid="section-moments" aria-labelledby="moments-title">
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={styles.sectionBody}>
          <SectionHeading
            title={<span id="moments-title">{homePageContent.moments.title}</span>}
            description={homePageContent.moments.description}
          />

          <div className={`${styles.gallery} reveal-grid`} data-testid="moment-feed-gallery" data-gallery-style="editorial-mosaic">
            {featuredMoments.map((item) => (
              <article key={item.id} className={styles.card} data-testid="moment-feed-card">
                <picture className={styles.media}>
                  {item.imageWebpSrcSet ? <source type="image/webp" srcSet={item.imageWebpSrcSet} sizes={item.sizes} /> : null}
                  <img
                    src={item.image}
                    alt={item.alt}
                    className={styles.image}
                    loading="lazy"
                    decoding="async"
                    width={item.width}
                    height={item.height}
                    sizes={item.sizes}
                    style={{ objectPosition: item.objectPosition }}
                  />
                </picture>

                <div className={styles.overlay}>
                  <span className={styles.badge}>{item.label}</span>
                  <p className={styles.title}>{item.title}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
