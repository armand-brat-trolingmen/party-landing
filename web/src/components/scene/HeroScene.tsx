import { heroSceneCards, heroSceneCenter } from '../../data/siteContent';
import styles from './HeroScene.module.css';

export function HeroScene() {
  return (
    <div className={styles.scene} aria-label="Сцена героя" data-testid="hero-scene">
      {heroSceneCards.map((card, index) => (
        <article
          key={card.id}
          className={`${styles.sideCard} ${index === 0 ? styles.sideCardLeft : styles.sideCardRight}`}
        >
          <div className={styles.sideMedia}>
            <img className={styles.vector} src={card.image} alt={card.label} />
          </div>
          <p className={styles.sideLabel}>{card.label}</p>
        </article>
      ))}

      <article className={styles.centerCard}>
        <div className={styles.centerGlow} aria-hidden="true" />
        <div className={styles.centerMedia}>
          <img className={styles.vector} src={heroSceneCenter.image} alt={heroSceneCenter.label} />
        </div>
        <p className={styles.centerLabel}>{heroSceneCenter.label}</p>
      </article>
    </div>
  );
}
