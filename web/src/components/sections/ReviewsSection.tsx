import { useState } from 'react';
import { avitoProfileUrl, momentFeedItems, momentFeedSectionCopy } from '../../data/siteContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './ReviewsSection.module.css';

function clampSlide(index: number) {
  return Math.max(0, Math.min(momentFeedItems.length - 1, index));
}

export function ReviewsSection() {
  const { ref, revealState } = useScrollReveal();
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const activeItem = momentFeedItems[activeSlide];

  function showPreviousSlide() {
    if (activeSlide === 0) {
      return;
    }

    setSlideDirection('prev');
    setActiveSlide((current) => clampSlide(current - 1));
  }

  function showNextSlide() {
    if (activeSlide === momentFeedItems.length - 1) {
      return;
    }

    setSlideDirection('next');
    setActiveSlide((current) => clampSlide(current + 1));
  }

  return (
    <section id="reviews" className="site-section" data-testid="section-reviews" aria-labelledby="reviews-title">
      <div
        ref={ref}
        className="site-container site-reveal"
        data-reveal-state={revealState}
        data-reveal-stagger="true"
      >
        <article className={`${styles.frame} site-panel-glow`}>
          <SectionHeading
            eyebrow={momentFeedSectionCopy.eyebrow}
            title={<span id="reviews-title">Лента моментов</span>}
            description={momentFeedSectionCopy.description}
          />

          <div className={`${styles.sliderShell} reveal-grid`}>
            <div
              className={styles.slider}
              data-testid="moment-feed-slider"
              data-slider-mode="manual"
              data-slider-layout="single-scene"
              data-slider-transition="soft-swap"
              data-active-slide={activeSlide}
            >
              <button
                type="button"
                className={`${styles.controlButton} ${styles.controlButtonPrev}`}
                aria-label="Предыдущий момент"
                disabled={activeSlide === 0}
                onClick={showPreviousSlide}
              >
                <span aria-hidden="true">←</span>
              </button>

              <article
                key={activeItem.id}
                className={styles.slide}
                data-testid="moment-feed-slide"
                data-slide-transition="soft-swap"
                data-slide-direction={slideDirection}
                data-tone={activeItem.tone}
              >
                <div className={styles.slideMedia}>
                  <picture className={styles.slidePicture}>
                    <source type="image/webp" srcSet={activeItem.imageWebpSrcSet} sizes={activeItem.sizes} />
                    <img
                      src={activeItem.image}
                      alt={activeItem.alt}
                      className={styles.slideImage}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      width={activeItem.width}
                      height={activeItem.height}
                      sizes={activeItem.sizes}
                      style={{ objectPosition: activeItem.objectPosition }}
                    />
                  </picture>
                </div>

                <div className={styles.slideContent}>
                  <span className={styles.slideBadge}>{activeItem.label}</span>
                  <p className={styles.slideTitle}>{activeItem.title}</p>
                </div>
              </article>

              <button
                type="button"
                className={`${styles.controlButton} ${styles.controlButtonNext}`}
                aria-label="Следующий момент"
                disabled={activeSlide === momentFeedItems.length - 1}
                onClick={showNextSlide}
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className={styles.avitoProof}>
              <div className={styles.avitoMark} aria-hidden="true">
                <span className={styles.avitoDotBlue} />
                <span className={styles.avitoDotGreen} />
                <span className={styles.avitoDotRed} />
                <span className={styles.avitoDotBlack} />
                <span className={styles.avitoText}>avito</span>
              </div>
              <div className={styles.avitoCopy}>
                <p className={styles.avitoTitle}>Нужен внешний proof?</p>
                <p className={styles.avitoDescription}>Часть живых отзывов и профиль можно посмотреть на Avito.</p>
              </div>
              <a className={styles.avitoLink} href={avitoProfileUrl} target="_blank" rel="noreferrer">
                Отзывы можно прочитать тут!
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
