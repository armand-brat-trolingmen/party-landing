type ResolveHeaderCompactStateArgs = {
  current: boolean;
  isDesktop: boolean;
  scrollY: number;
};

type ResolveHeaderScrollProgressArgs = {
  isDesktop: boolean;
  scrollY: number;
};

const DESKTOP_COMPACT_ENTER_Y = 156;
const DESKTOP_COMPACT_EXIT_Y = 42;
const MOBILE_COMPACT_ENTER_Y = 72;
const MOBILE_COMPACT_EXIT_Y = 20;
const DESKTOP_PROGRESS_END_Y = 220;
const MOBILE_PROGRESS_END_Y = 72;

function clamp01(value: number) {
  if (value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 1;
  }

  return value;
}

export function resolveHeaderCompactState({ current, isDesktop, scrollY }: ResolveHeaderCompactStateArgs) {
  const enterY = isDesktop ? DESKTOP_COMPACT_ENTER_Y : MOBILE_COMPACT_ENTER_Y;
  const exitY = isDesktop ? DESKTOP_COMPACT_EXIT_Y : MOBILE_COMPACT_EXIT_Y;

  if (current) {
    return scrollY > exitY;
  }

  return scrollY >= enterY;
}

export function resolveHeaderScrollProgress({ isDesktop, scrollY }: ResolveHeaderScrollProgressArgs) {
  const maxY = isDesktop ? DESKTOP_PROGRESS_END_Y : MOBILE_PROGRESS_END_Y;
  return clamp01(scrollY / maxY);
}
