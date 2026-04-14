import styles from './ServiceMomentsGallery.module.css';

const PLACEHOLDER_COUNT = 4;

export function ServiceMomentsGallery() {
  return (
    <section className={styles.section} data-testid="offering-gallery" aria-labelledby="offering-gallery-title">
      <div className={styles.header}>
        <h2 id="offering-gallery-title" className={styles.title}>
          Галерея моментов
        </h2>
      </div>

      <div className={styles.track} data-testid="offering-gallery-track">
        {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
          <div
            key={index}
            className={styles.card}
            data-testid="offering-gallery-card"
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}
