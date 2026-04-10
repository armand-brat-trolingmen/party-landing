import { avitoProfileUrl, siteConfig } from '../../content';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './TestimonialsSection.module.css';

export function TestimonialsSection() {
  const { ref, revealState } = useScrollReveal();

  return (
    <section id="testimonials" className="site-section" data-testid="section-testimonials" aria-labelledby="testimonials-title">
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={styles.sectionBody}>
          <SectionHeading
            title={<span id="testimonials-title">{siteConfig.homepage.reviews.title}</span>}
            description={siteConfig.homepage.reviews.description}
          />

          <div className={`${styles.grid} reveal-grid`} data-testid="testimonials-grid">
            {siteConfig.testimonials.map((review) => (
              <article key={review.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.meta}>
                    <span className={styles.author}>{review.author}</span>
                    <span className={styles.eventType}>{review.eventType}</span>
                  </div>
                  <span className={styles.rating}>★ {review.ratingLabel}</span>
                </div>
                <p className={styles.quote}>{review.quote}</p>
              </article>
            ))}
          </div>

          <div className={styles.proof} data-testid="testimonials-proof">
            <div className={styles.proofCopy}>
              <p className={styles.proofTitle}>{siteConfig.homepage.reviews.avitoTitle}</p>
              <p className={styles.proofDescription}>{siteConfig.homepage.reviews.avitoDescription}</p>
            </div>
            <a className={styles.proofLink} href={avitoProfileUrl} target="_blank" rel="noreferrer">
              Перейти на Avito
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
