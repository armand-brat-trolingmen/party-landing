import { heroSceneItems } from '../../data/siteContent';
import styles from './HeroScene.module.css';

export function HeroScene() {
  const fanLayoutClasses = [styles.cardCottonCandy, styles.cardFoodTruck, styles.cardChocolateFountain];

  return (
    <div className={styles.scene} aria-label="Сцена героя" data-testid="hero-scene">
      <div className={styles.frame} data-testid="hero-scene-frame">
        {heroSceneItems.map((item, index) => (
          <article
            key={item.id}
            data-testid="hero-scene-card"
            className={`${styles.card} ${fanLayoutClasses[index] ?? ''}`}
          >
            <div className={styles.media}>
              <img className={styles.vector} src={item.image} alt={item.label} />
            </div>
            <p className={styles.label}>{item.label}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
