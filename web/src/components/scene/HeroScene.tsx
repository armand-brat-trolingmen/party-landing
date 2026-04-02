import { useEffect, useRef } from 'react';
import { heroSceneItems } from '../../data/siteContent';
import styles from './HeroScene.module.css';

export function HeroScene() {
  const fanLayoutClasses = [styles.itemCottonCandy, styles.itemFoodTruck, styles.itemChocolateFountain];
  const motionDepths = ['back', 'front', 'mid'] as const;
  const cardTestIds = ['hero-scene-card-cotton-candy', 'hero-scene-card-food-truck', 'hero-scene-card-chocolate-fountain'];
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || typeof window === 'undefined') {
      return;
    }

    const supportsMatchMedia = typeof window.matchMedia === 'function';
    const prefersReducedMotion = supportsMatchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
    const supportsFinePointer = supportsMatchMedia ? window.matchMedia('(pointer: fine)').matches : false;
    let rafId = 0;

    const writePointer = (x: number, y: number) => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      rafId = window.requestAnimationFrame(() => {
        frame.style.setProperty('--hero-pointer-x', x.toFixed(3));
        frame.style.setProperty('--hero-pointer-y', y.toFixed(3));
      });
    };

    const resetPointer = () => writePointer(0, 0);

    const syncScroll = () => {
      const rect = frame.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = ((viewportHeight * 0.62 - rect.top) / (viewportHeight + rect.height) - 0.25) * 2;
      const clamped = Math.max(-1, Math.min(1, progress));
      frame.style.setProperty('--hero-scroll-shift', `${(clamped * 14).toFixed(2)}px`);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      writePointer(x, y);
    };

    syncScroll();

    if (!prefersReducedMotion && supportsFinePointer) {
      frame.addEventListener('pointermove', handlePointerMove);
      frame.addEventListener('pointerleave', resetPointer);
    }

    if (!prefersReducedMotion) {
      window.addEventListener('scroll', syncScroll, { passive: true });
      window.addEventListener('resize', syncScroll);
    }

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      frame.removeEventListener('pointermove', handlePointerMove);
      frame.removeEventListener('pointerleave', resetPointer);
      window.removeEventListener('scroll', syncScroll);
      window.removeEventListener('resize', syncScroll);
    };
  }, []);

  return (
    <div
      className={styles.scene}
      aria-label="РЎС†РµРЅР° РіРµСЂРѕСЏ"
      data-testid="hero-scene"
      data-motion-scene="layered"
    >
      <div ref={frameRef} className={styles.frame} data-testid="hero-scene-frame" data-motion-frame="parallax">
        {heroSceneItems.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.item} ${fanLayoutClasses[index] ?? ''}`}
            data-testid={cardTestIds[index]}
            data-motion-depth={motionDepths[index]}
          >
            <div className={styles.itemMedia}>
              <img className={styles.vector} src={item.image} alt={item.label} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
