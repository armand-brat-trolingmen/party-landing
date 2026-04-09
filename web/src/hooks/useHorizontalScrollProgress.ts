import { useEffect, useRef, useState } from 'react';

function clampProgress(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function useHorizontalScrollProgress(enabled: boolean) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const node = scrollerRef.current;
    if (!node) {
      return;
    }

    const sync = () => {
      const maxScroll = Math.max(node.scrollWidth - node.clientWidth, 0);
      const nextProgress = maxScroll === 0 ? 0 : (node.scrollLeft / maxScroll) * 100;
      setProgress(clampProgress(nextProgress));
    };

    sync();
    node.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);

    return () => {
      node.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [enabled]);

  return { scrollerRef, progress };
}
