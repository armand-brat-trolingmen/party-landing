import { activeReviewVariant, reviewPhotos, reviewSectionCopy, reviewStories } from '../../data/siteContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './ReviewsSection.module.css';

export function ReviewsSection() {
  const { ref, revealState } = useScrollReveal();
  const reviewCopy = reviewSectionCopy[activeReviewVariant];

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
            eyebrow={reviewCopy.eyebrow}
            title={<span id="reviews-title">Отзывы</span>}
            description={reviewCopy.description}
          />
          {activeReviewVariant === 'stories' ? (
            <div className={`${styles.storyGrid} reveal-grid`} data-testid="reviews-stories">
              {reviewStories.map((story) => (
                <article
                  key={story.id}
                  className={styles.storyCard}
                  data-testid="review-story-card"
                  data-motion-card="cinematic"
                >
                  <div className={styles.storyMediaWrap}>
                    <img
                      src={story.image}
                      alt={story.alt}
                      className={styles.storyPhoto}
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: story.objectPosition }}
                    />
                    <span className={styles.storyBadge}>{story.badge}</span>
                  </div>

                  <div className={styles.storyContent}>
                    <h3 className={styles.storyTitle}>{story.title}</h3>
                    <p className={styles.storySummary}>{story.summary}</p>
                    <p className={styles.storyMeta}>{story.meta}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={`${styles.grid} reveal-grid`} data-testid="reviews-gallery">
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
                  <figcaption className={styles.caption}>
                    <span className={styles.label}>{photo.title}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
