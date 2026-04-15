import type { ServiceGalleryImage } from '../../content/serviceGalleries.generated';
import styles from './ServiceMomentsGallery.module.css';

type ServiceMomentsGalleryProps = {
  images: readonly ServiceGalleryImage[];
};

export function ServiceMomentsGallery({ images }: ServiceMomentsGalleryProps) {
  if (!images.length) {
    return null;
  }

  return (
    <section className={styles.section} data-testid="offering-gallery" aria-labelledby="offering-gallery-title">
      <div className={styles.header}>
        <h2 id="offering-gallery-title" className={styles.title}>
          Галерея моментов
        </h2>
      </div>

      <div className={styles.track} data-testid="offering-gallery-track">
        {images.map((image) => (
          <article key={image.id} className={styles.slide} data-testid="offering-gallery-slide">
            <picture className={styles.media}>
              <source data-testid="offering-gallery-source-webp" type="image/webp" srcSet={image.webpSrcSet} sizes={image.sizes} />
              <img
                className={styles.image}
                data-testid="offering-gallery-image"
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
                sizes={image.sizes}
              />
            </picture>
          </article>
        ))}
      </div>
    </section>
  );
}
