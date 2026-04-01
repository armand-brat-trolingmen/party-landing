import { heroSceneItems } from '../../data/siteContent';
import styles from './HeroScene.module.css';

export function HeroScene() {
  const fanLayoutClasses = [styles.itemCottonCandy, styles.itemFoodTruck, styles.itemChocolateFountain];

  return (
    <div className={styles.scene} aria-label="Сцена героя" data-testid="hero-scene">
      <div className={styles.frame} data-testid="hero-scene-frame">
        {heroSceneItems.map((item, index) => (
          <div key={item.id} className={`${styles.item} ${fanLayoutClasses[index] ?? ''}`}>
            <div className={styles.itemMedia}>
              <img className={styles.vector} src={item.image} alt={item.label} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
