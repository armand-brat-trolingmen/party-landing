import { heroSceneCards, heroSceneCenter } from '../../data/siteContent';
import styles from './HeroScene.module.css';

function CottonCandyPlaceholder() {
  return (
    <svg className={styles.vector} viewBox="0 0 220 260" aria-hidden="true">
      <defs>
        <linearGradient id="cottonCloud" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9C7D9" />
          <stop offset="100%" stopColor="#F095B8" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="220" height="260" rx="32" fill="#FFF8F4" />
      <ellipse cx="110" cy="72" rx="44" ry="28" fill="url(#cottonCloud)" />
      <ellipse cx="84" cy="100" rx="46" ry="31" fill="url(#cottonCloud)" />
      <ellipse cx="135" cy="107" rx="43" ry="30" fill="url(#cottonCloud)" />
      <ellipse cx="110" cy="130" rx="54" ry="34" fill="#F6A7C4" />
      <rect x="104" y="150" width="10" height="62" rx="5" fill="#E2B37A" />
      <ellipse cx="110" cy="216" rx="42" ry="12" fill="rgba(107, 74, 53, 0.08)" />
      <circle cx="58" cy="56" r="4" fill="#FFF0A6" />
      <circle cx="158" cy="58" r="5" fill="#FFDCE9" />
    </svg>
  );
}

function ChocolateFountainPlaceholder() {
  return (
    <svg className={styles.vector} viewBox="0 0 220 260" aria-hidden="true">
      <rect x="0" y="0" width="220" height="260" rx="32" fill="#FFF7EF" />
      <ellipse cx="110" cy="220" rx="64" ry="16" fill="rgba(107, 74, 53, 0.08)" />
      <ellipse cx="110" cy="190" rx="52" ry="18" fill="#7A5238" />
      <rect x="96" y="118" width="28" height="76" rx="14" fill="#8B5E3F" />
      <ellipse cx="110" cy="118" rx="42" ry="14" fill="#A7724D" />
      <ellipse cx="110" cy="94" rx="34" ry="12" fill="#8B5E3F" />
      <rect x="100" y="70" width="20" height="48" rx="10" fill="#9B6A46" />
      <ellipse cx="110" cy="68" rx="26" ry="10" fill="#6B4A35" />
      <path d="M110 56c10 6 12 16 5 22-6 5-6 12 0 19" stroke="#4F3324" strokeWidth="6" strokeLinecap="round" />
      <path d="M101 80c-6 5-7 12-3 17" stroke="#4F3324" strokeWidth="5" strokeLinecap="round" />
      <circle cx="66" cy="64" r="5" fill="#FFF0A6" />
      <circle cx="156" cy="54" r="4" fill="#F7A6C3" />
    </svg>
  );
}

function FoodTruckPlaceholder() {
  return (
    <svg className={styles.vector} viewBox="0 0 360 280" role="img" aria-label={heroSceneCenter.label}>
      <rect x="0" y="0" width="360" height="280" rx="44" fill="#FFF9F2" />
      <ellipse cx="180" cy="228" rx="110" ry="24" fill="rgba(107, 74, 53, 0.08)" />
      <rect x="64" y="94" width="182" height="92" rx="22" fill="#F5B4C7" />
      <rect x="82" y="112" width="70" height="38" rx="12" fill="#FFF3DC" />
      <rect x="163" y="112" width="63" height="52" rx="12" fill="#FFE7A6" />
      <rect x="244" y="118" width="44" height="68" rx="12" fill="#F7C6D8" />
      <path d="M98 92c14-24 28-36 54-36 30 0 49 15 66 36" stroke="#FFF4E8" strokeWidth="16" strokeLinecap="round" />
      <circle cx="118" cy="196" r="20" fill="#6B4A35" />
      <circle cx="258" cy="196" r="20" fill="#6B4A35" />
      <circle cx="118" cy="196" r="9" fill="#FFF8F0" />
      <circle cx="258" cy="196" r="9" fill="#FFF8F0" />
      <path d="M254 104h34l20 27v17h-54z" fill="#FFD86E" />
      <rect x="74" y="76" width="20" height="18" rx="8" fill="#E45745" />
      <circle cx="304" cy="88" r="9" fill="#FFF0A6" />
      <circle cx="322" cy="104" r="6" fill="#F7A6C3" />
    </svg>
  );
}

function SceneArtwork({ id }: { id: (typeof heroSceneCards)[number]['id'] }) {
  if (id === 'cotton-candy') {
    return <CottonCandyPlaceholder />;
  }

  return <ChocolateFountainPlaceholder />;
}

export function HeroScene() {
  return (
    <div className={styles.scene} aria-label="Сцена героя" data-testid="hero-scene">
      {heroSceneCards.map((card, index) => (
        <article
          key={card.id}
          className={`${styles.sideCard} ${index === 0 ? styles.sideCardLeft : styles.sideCardRight}`}
        >
          <div className={styles.sideMedia}>
            <SceneArtwork id={card.id} />
          </div>
          <p className={styles.sideLabel}>{card.label}</p>
        </article>
      ))}

      <article className={styles.centerCard}>
        <div className={styles.centerGlow} aria-hidden="true" />
        <div className={styles.centerMedia}>
          <FoodTruckPlaceholder />
        </div>
        <p className={styles.centerLabel}>{heroSceneCenter.label}</p>
      </article>
    </div>
  );
}
