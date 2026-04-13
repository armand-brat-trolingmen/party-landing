import type { CSSProperties } from 'react';
import type { CatalogVisual } from '../../content';
import styles from './OfferingVisual.module.css';

type OfferingVisualProps = {
  visual: CatalogVisual;
  label: string;
};

export function OfferingVisual({ visual, label }: OfferingVisualProps) {
  const toneClass = styles[visual.tone];

  return (
    <div
      className={`${styles.visual} ${toneClass}`}
      style={
        visual.width
          ? ({
              ['--offering-image-width' as string]: `${visual.width}px`,
            } as CSSProperties)
          : undefined
      }
    >
      {visual.image ? (
        <img
          src={visual.image}
          alt={visual.alt ?? label}
          className={styles.image}
          width={visual.width}
          height={visual.height}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      ) : (
        <div className={styles.placeholder} aria-label={label}>
          <span className={styles.emoji} aria-hidden="true">
            {visual.emoji}
          </span>
          <span className={styles.name}>{label}</span>
        </div>
      )}
    </div>
  );
}
