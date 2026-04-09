import { useEffect, useRef, useState } from 'react';
import styles from './TextLoop.module.css';

type TextLoopDirection = 'left' | 'right';

type TextLoopProps = {
  items: readonly string[];
  separator?: string;
  className?: string;
  speed?: number;
  hoverSpeed?: number;
  direction?: TextLoopDirection;
};

const MIN_COPIES = 2;
const COPY_HEADROOM = 2;
const SMOOTH_TAU = 0.24;

function getTransform(offset: number, sequenceWidth: number, direction: TextLoopDirection) {
  if (sequenceWidth <= 0) {
    return 'translate3d(0, 0, 0)';
  }

  const translateX = direction === 'right' ? offset - sequenceWidth : -offset;
  return `translate3d(${translateX}px, 0, 0)`;
}

export function TextLoop({
  items,
  separator = '\u2022',
  className,
  speed = 84,
  hoverSpeed = 28,
  direction = 'right',
}: TextLoopProps) {
  const loopItems = items.length > 0 ? [...items, ...items] : [];
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLUListElement>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(speed);
  const hoveredRef = useRef(false);
  const [sequenceWidth, setSequenceWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(MIN_COPIES);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener?.('change', syncPreference);
    mediaQuery.addListener?.(syncPreference);

    return () => {
      mediaQuery.removeEventListener?.('change', syncPreference);
      mediaQuery.removeListener?.(syncPreference);
    };
  }, []);

  useEffect(() => {
    velocityRef.current = hoveredRef.current ? hoverSpeed : speed;
  }, [hoverSpeed, speed]);

  useEffect(() => {
    const updateMetrics = () => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const measuredSequenceWidth = Math.ceil(sequenceRef.current?.getBoundingClientRect().width ?? 0);

      if (measuredSequenceWidth <= 0) {
        return;
      }

      setSequenceWidth(measuredSequenceWidth);
      setCopyCount(Math.max(MIN_COPIES, Math.ceil(containerWidth / measuredSequenceWidth) + COPY_HEADROOM));
    };

    const container = containerRef.current;
    const sequence = sequenceRef.current;
    updateMetrics();

    if (typeof ResizeObserver !== 'undefined' && container && sequence) {
      const resizeObserver = new ResizeObserver(updateMetrics);
      resizeObserver.observe(container);
      resizeObserver.observe(sequence);

      return () => resizeObserver.disconnect();
    }

    window.addEventListener('resize', updateMetrics);
    return () => window.removeEventListener('resize', updateMetrics);
  }, [items, separator]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    track.style.transform = getTransform(offsetRef.current, sequenceWidth, direction);

    if (prefersReducedMotion || sequenceWidth <= 0) {
      return;
    }

    let animationFrameId = 0;
    let lastTimestamp: number | null = null;

    const animate = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const targetSpeed = hoveredRef.current ? hoverSpeed : speed;
      const easingFactor = 1 - Math.exp(-deltaTime / SMOOTH_TAU);
      velocityRef.current += (targetSpeed - velocityRef.current) * easingFactor;
      offsetRef.current = (offsetRef.current + velocityRef.current * deltaTime) % sequenceWidth;

      track.style.transform = getTransform(offsetRef.current, sequenceWidth, direction);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animationFrameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [direction, hoverSpeed, prefersReducedMotion, sequenceWidth, speed]);

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (!canHover) {
        return;
      }
    }

    hoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    hoveredRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-testid="text-loop"
      data-ready={sequenceWidth > 0 ? 'true' : 'false'}
      data-hover-behavior="slowdown"
      data-direction={direction}
      data-edge-mask="none"
      aria-hidden="true"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={trackRef} className={styles.track} data-testid="text-loop-track">
        {Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            key={`sequence-${copyIndex}`}
            ref={copyIndex === 0 ? sequenceRef : undefined}
            className={styles.sequence}
            data-testid={copyIndex === 0 ? 'text-loop-sequence-primary' : undefined}
            aria-hidden={copyIndex > 0}
          >
            {loopItems.map((item, itemIndex) => (
              <li key={`${copyIndex}-${item}-${itemIndex}`} className={styles.item}>
                <span className={styles.label}>{item}</span>
                <span className={styles.separator}>{separator}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
