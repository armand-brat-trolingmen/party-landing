import { useEffect, useState } from 'react';

function getInitialMatch(query: string) {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }

  return window.matchMedia(query).matches;
}

export function useMediaQuery(query: string) {
  // Read matchMedia immediately when the browser is available so hydration avoids a false desktop-first flip.
  const [matches, setMatches] = useState(() => getInitialMatch(query));

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const sync = () => setMatches(mediaQuery.matches);

    sync();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', sync);
      return () => mediaQuery.removeEventListener('change', sync);
    }

    mediaQuery.addListener(sync);
    return () => mediaQuery.removeListener(sync);
  }, [query]);

  return matches;
}
