import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ServiceGalleryImage } from '../../content/serviceGalleries.generated';
import styles from './ServiceMomentsGallery.module.css';

type ServiceMomentsGalleryProps = {
  images: readonly ServiceGalleryImage[];
};

function focusWithoutScroll(element: HTMLElement | null) {
  if (!element) {
    return;
  }

  try {
    element.focus({ preventScroll: true });
  } catch {
    element.focus();
  }
}

const useSafeLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type GalleryCloseReason = 'pointer' | 'keyboard';

export function ServiceMomentsGallery({ images }: ServiceMomentsGalleryProps) {
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeReasonRef = useRef<GalleryCloseReason>('pointer');
  const activeImage = images.find((image) => image.id === activeImageId) ?? null;

  function closePreview(reason: GalleryCloseReason) {
    closeReasonRef.current = reason;
    setActiveImageId(null);
  }

  useSafeLayoutEffect(() => {
    if (!activeImage) {
      return;
    }

    const scrollY = window.scrollY;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyLeft = document.body.style.left;
    const previousBodyRight = document.body.style.right;
    const previousBodyWidth = document.body.style.width;
    const activeTrigger = triggerRefs.current[activeImage.id];

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closePreview('keyboard');
      }
    }

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    window.addEventListener('keydown', handleKeyDown);
    focusWithoutScroll(closeButtonRef.current);

    return () => {
      const shouldRestoreTriggerFocus = closeReasonRef.current === 'keyboard';

      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.left = previousBodyLeft;
      document.body.style.right = previousBodyRight;
      document.body.style.width = previousBodyWidth;
      window.removeEventListener('keydown', handleKeyDown);
      window.scrollTo({ top: scrollY, left: 0, behavior: 'auto' });
      if (shouldRestoreTriggerFocus) {
        focusWithoutScroll(activeTrigger);
      }
      closeReasonRef.current = 'pointer';
    };
  }, [activeImage]);

  if (!images.length) {
    return null;
  }

  const previewDialog =
    activeImage && typeof document !== 'undefined'
      ? createPortal(
          <div
            className={styles.dialogOverlay}
            role="presentation"
            onClick={() => closePreview('pointer')}
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

              <div className={styles.dialogMedia}>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className={styles.dialogClose}
                  onClick={(event) => {
                    event.stopPropagation();
                    closePreview(event.detail === 0 ? 'keyboard' : 'pointer');
                  }}
                  aria-label="Закрыть фото услуги"
                >
                  ×
                </button>

                <picture className={styles.dialogPicture} onClick={(event) => event.stopPropagation()}>
                  <img
                    className={styles.dialogImage}
                    src={activeImage.originalSrc}
                    alt={activeImage.alt}
                    width={activeImage.originalWidth}
                    height={activeImage.originalHeight}
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
                onClick={() => {
                  closeReasonRef.current = 'pointer';
                  setActiveImageId(image.id);
                }}
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
