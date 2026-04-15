import { avitoProfileUrl, siteConfig } from '../../content';
import { testimonialScreenshots } from '../../content/testimonialScreenshots';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './TestimonialsSection.module.css';

export function TestimonialsSection() {
  const { ref, revealState } = useScrollReveal();

  return (
    <section id="testimonials" className="site-section" data-testid="section-testimonials" aria-labelledby="testimonials-title">
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={styles.sectionBody}>
          <SectionHeading title={<span id="testimonials-title">{siteConfig.homepage.reviews.title}</span>} />

          <div className={`${styles.proofWall} reveal-grid`} data-testid="testimonials-proof-wall">
            <div className={styles.proof} data-testid="testimonials-proof">
              <div className={styles.proofCopy}>
                <p className={styles.proofTitle}>{siteConfig.homepage.reviews.avitoTitle}</p>
                <p className={styles.proofDescription}>{siteConfig.homepage.reviews.avitoDescription}</p>
              </div>
              <a className={styles.proofLink} href={avitoProfileUrl} target="_blank" rel="noreferrer">
                Перейти на Avito
              </a>
            </div>

            {testimonialScreenshots.map((review) => (
              <figure
                key={review.id}
                className={styles.screenshotCard}
                data-testid="testimonial-screenshot-card"
                data-review-tone={review.tone}
              >
                <div className={styles.screenshotFrame}>
                  <picture className={styles.screenshotPicture}>
                    <source type="image/webp" srcSet={review.webpSrc} />
                    <img
                      className={styles.screenshotImage}
                      src={review.src}
                      alt={review.alt}
                      width={review.width}
                      height={review.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
