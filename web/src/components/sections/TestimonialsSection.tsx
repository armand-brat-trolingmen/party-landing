import { homePageContent, reviewProofs } from '../../data/catalogContent';
import { avitoProfileUrl } from '../../data/siteContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './TestimonialsSection.module.css';

export function TestimonialsSection() {
  const { ref, revealState } = useScrollReveal();

  return (
    <section id="testimonials" className="site-section" data-testid="section-testimonials" aria-labelledby="testimonials-title">
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={styles.sectionBody} data-section-surface="canvas" data-section-tone="blush">
          <SectionHeading
            title={<span id="testimonials-title">{homePageContent.reviews.title}</span>}
            description={homePageContent.reviews.description}
          />

          <div className={`${styles.grid} reveal-grid`} data-testid="testimonials-grid">
            {reviewProofs.map((review) => (
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

          <div className={styles.proof}>
            <div>
              <p className={styles.proofTitle}>{homePageContent.reviews.avitoTitle}</p>
              <p className={styles.proofDescription}>{homePageContent.reviews.avitoDescription}</p>
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
