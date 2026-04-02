import { reviewPhotos } from '../../data/siteContent';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './ReviewsSection.module.css';

export function ReviewsSection() {
  return (
    <section id="reviews" className="site-section" data-testid="section-reviews" aria-labelledby="reviews-title">
      <div className="site-container">
        <article className={styles.frame}>
          <SectionHeading
            eyebrow="Живые кадры"
            title={<span id="reviews-title">Отзывы</span>}
            description="Кадры с наших событий Party: эмоции, детали и вкусные акценты."
          />
          <div className={styles.grid}>
            {reviewPhotos.map((photo) => (
              <figure key={photo.id} className={styles.photoCard}>
                <img
                  src={photo.image}
                  alt={photo.alt}
                  className={styles.photo}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: photo.objectPosition }}
                />
              </figure>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
