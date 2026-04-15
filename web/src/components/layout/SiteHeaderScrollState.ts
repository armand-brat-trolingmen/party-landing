type ResolveHeaderCompactStateArgs = {
  current: boolean;
  isDesktop: boolean;
  scrollY: number;
};

type ResolveHeaderScrollProgressArgs = {
  isDesktop: boolean;
  scrollY: number;
};

type ResolveMobileBrandTextShiftArgs = {
  currentShift: number;
  plateRight: number;
  textLeft: number;
  textWidth: number;
  menuLeft: number;
};

const MOBILE_BRAND_MIN_GAP = 8;

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

export function resolveMobileBrandTextShift({
  currentShift,
  plateRight,
  textLeft,
  textWidth,
  menuLeft,
}: ResolveMobileBrandTextShiftArgs) {
  if (
    !Number.isFinite(currentShift) ||
    !Number.isFinite(plateRight) ||
    !Number.isFinite(textLeft) ||
    !Number.isFinite(textWidth) ||
    !Number.isFinite(menuLeft) ||
    textWidth <= 0
  ) {
    return 0;
  }

  const measuredTextCenter = textLeft + textWidth / 2;
  const naturalTextCenter = measuredTextCenter - currentShift;
  const minTextCenter = plateRight + MOBILE_BRAND_MIN_GAP + textWidth / 2;
  const maxTextCenter = menuLeft - MOBILE_BRAND_MIN_GAP - textWidth / 2;
  const desiredTextCenter = (plateRight + menuLeft) / 2;
  const clampedTextCenter =
    minTextCenter <= maxTextCenter
      ? Math.min(Math.max(desiredTextCenter, minTextCenter), maxTextCenter)
      : Math.max(desiredTextCenter, minTextCenter);

  return clampedTextCenter - naturalTextCenter;
}
