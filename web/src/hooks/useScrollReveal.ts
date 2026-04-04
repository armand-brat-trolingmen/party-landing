import { useEffect, useRef, useState } from 'react';

type ScrollRevealOptions = {
  rootMargin?: string;
  threshold?: number;
};

type RevealState = 'pending' | 'visible';

function shouldRevealImmediately() {
  if (typeof window === 'undefined') {
    return false;
  }

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  return prefersReducedMotion || typeof window.IntersectionObserver === 'undefined';
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options: ScrollRevealOptions = {}) {
  const { rootMargin = '0px 0px -12% 0px', threshold = 0.18 } = options;
  const ref = useRef<T | null>(null);
  const [revealState, setRevealState] = useState<RevealState>(() =>
    shouldRevealImmediately() ? 'visible' : 'pending',
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    node.style.setProperty('--reveal-soft-duration', '880ms');

    if (revealState === 'visible' || shouldRevealImmediately()) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.intersectionRatio >= threshold / 2) {
          setRevealState('visible');
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [revealState, rootMargin, threshold]);

  return { ref, revealState };
}
