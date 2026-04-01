import { galleryItems } from '../../data/siteContent';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './GallerySection.module.css';

export function GallerySection() {
  return (
    <section id="gallery" className="site-section" data-testid="section-gallery" aria-labelledby="gallery-title">
      <div className="site-container">
        <article className={styles.frame}>
          <SectionHeading
            eyebrow="Предметные сцены"
            title={<span id="gallery-title">Галерея</span>}
            description="Только детали сервиса: фудтрак, шоколадный фонтан и сладкая вата без постановочных кадров с людьми."
          />
          <div className={styles.grid}>
            {galleryItems.map((item) => (
              <figure key={item.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <img src={item.image} alt={item.alt} className={styles.image} loading="lazy" />
                </div>
                <figcaption className={styles.caption}>{item.title}</figcaption>
              </figure>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
