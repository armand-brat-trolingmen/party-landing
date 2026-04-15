import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ServiceGalleryImage } from '../../content/serviceGalleries.generated';
import styles from './ServiceMomentsGallery.module.css';

type ServiceMomentsGalleryProps = {
  images: readonly ServiceGalleryImage[];
};

export function ServiceMomentsGallery({ images }: ServiceMomentsGalleryProps) {
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  if (!images.length) {
    return null;
  }

  const activeImage = images.find((image) => image.id === activeImageId) ?? null;

  useEffect(() => {
    if (!activeImage) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const activeTrigger = triggerRefs.current[activeImage.id];

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveImageId(null);
      }
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      activeTrigger?.focus();
    };
  }, [activeImage]);

  const previewDialog =
    activeImage && typeof document !== 'undefined'
      ? createPortal(
          <div
            className={styles.dialogOverlay}
            role="presentation"
            onClick={() => setActiveImageId(null)}
            data-testid="offering-gallery-dialog-overlay"
            data-dialog-state="open"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Фотография услуги"
              aria-describedby="offering-gallery-dialog-description"
              className={styles.dialog}
              data-testid="offering-gallery-dialog"
              data-dialog-presentation="fullscreen"
            >
              <p id="offering-gallery-dialog-description" className={styles.dialogDescription}>
                Полноэкранный просмотр фотографии услуги.
              </p>

              <div className={styles.dialogMedia} onClick={(event) => event.stopPropagation()}>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className={styles.dialogClose}
                  onClick={() => setActiveImageId(null)}
                  aria-label="Закрыть фото услуги"
                >
                  ×
                </button>

                <picture className={styles.dialogPicture}>
                  <source type="image/webp" srcSet={activeImage.webpSrcSet} sizes="100vw" />
                  <img
                    className={styles.dialogImage}
                    src={activeImage.src}
                    alt={activeImage.alt}
                    width={activeImage.width}
                    height={activeImage.height}
                    decoding="async"
                  />
                </picture>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <section className={styles.section} data-testid="offering-gallery" aria-labelledby="offering-gallery-title">
        <div className={styles.header}>
          <h2 id="offering-gallery-title" className={styles.title}>
            Галерея моментов
          </h2>
        </div>

        <div className={styles.track} data-testid="offering-gallery-track">
          {images.map((image, index) => (
            <article key={image.id} className={styles.slide} data-testid="offering-gallery-slide">
              <button
                ref={(node) => {
                  triggerRefs.current[image.id] = node;
                }}
                type="button"
                className={styles.slideButton}
                data-testid="offering-gallery-open-button"
                aria-label={`Открыть фото ${index + 1} на весь экран`}
                onClick={() => setActiveImageId(image.id)}
              >
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
              </button>
            </article>
          ))}
        </div>
      </section>

      {previewDialog}
    </>
  );
}
