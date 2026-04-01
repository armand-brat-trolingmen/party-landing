import { heroSceneCards, heroSceneCenter } from '../../data/siteContent';
import styles from './HeroScene.module.css';

export function HeroScene() {
  return (
    <div className={styles.scene} aria-label="Сцена героя">
      {heroSceneCards.map((card, index) => (
        <article
          key={card.id}
          className={`${styles.sideCard} ${index === 0 ? styles.sideCardLeft : styles.sideCardRight}`}
        >
          <div className={styles.sideMedia}>
            <img className={styles.sideImage} src={card.image} alt={card.label} />
          </div>
          <p className={styles.sideLabel}>{card.label}</p>
        </article>
      ))}

      <article className={styles.centerCard}>
        <div className={styles.centerGlow} aria-hidden="true" />
        <img className={styles.centerImage} src={heroSceneCenter.image} alt={heroSceneCenter.label} />
        <p className={styles.centerLabel}>{heroSceneCenter.label}</p>
      </article>
    </div>
  );
}
