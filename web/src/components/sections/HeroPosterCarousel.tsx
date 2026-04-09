import { useEffect, useMemo, useState } from 'react';
import styles from './HeroPosterCarousel.module.css';

export type HeroPosterSlide = {
  id: string;
  image: string;
  fallbackImage?: string;
  imageWebpSrcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt: string;
  objectPosition?: string;
};

type HeroPosterCarouselProps = {
  slides: readonly HeroPosterSlide[];
  intervalMs?: number;
};

export function HeroPosterCarousel({ slides, intervalMs = 5200 }: HeroPosterCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const progressWidth = useMemo(() => `${100 / Math.max(slides.length, 1)}%`, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [intervalMs, slides.length]);

  return (
    <div className={styles.carousel} data-testid="hero-poster-carousel" data-active-index={activeIndex}>
      <div className={styles.frame} data-testid="hero-poster-frame">
        <div className={styles.viewport}>
          <div className={styles.track} style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}>
            {slides.map((slide, index) => (
              <figure
                key={slide.id}
                className={styles.slide}
                data-visible={index === activeIndex ? 'true' : 'false'}
                aria-hidden={index === activeIndex ? undefined : true}
              >
                <picture className={styles.posterMedia}>
                  {slide.imageWebpSrcSet ? (
                    <source
                      data-testid="hero-poster-source-webp"
                      type="image/webp"
                      srcSet={slide.imageWebpSrcSet}
                      sizes={slide.sizes}
                    />
                  ) : null}
                  <img
                    className={styles.poster}
                    src={slide.fallbackImage ?? slide.image}
                    alt={slide.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    width={slide.width}
                    height={slide.height}
                    sizes={slide.sizes}
                    style={{ objectPosition: slide.objectPosition }}
                  />
                </picture>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.progress} aria-hidden="true">
        <span
          className={styles.progressBar}
          style={{
            width: progressWidth,
            transform: `translate3d(${activeIndex * 100}%, 0, 0)`,
          }}
        />
      </div>
    </div>
  );
}
