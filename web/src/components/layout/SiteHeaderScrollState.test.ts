import {
  resolveHeaderCompactState,
  resolveHeaderScrollProgress,
  resolveMobileBrandTextShift,
} from './SiteHeaderScrollState';

test('desktop header waits for a deeper scroll before entering the compact state', () => {
  expect(resolveHeaderCompactState({ current: false, isDesktop: true, scrollY: 18 })).toBe(false);
  expect(resolveHeaderCompactState({ current: false, isDesktop: true, scrollY: 92 })).toBe(false);
  expect(resolveHeaderCompactState({ current: false, isDesktop: true, scrollY: 156 })).toBe(true);
});

test('desktop header uses hysteresis so it does not bounce back immediately after shrinking', () => {
  expect(resolveHeaderCompactState({ current: true, isDesktop: true, scrollY: 52 })).toBe(true);
  expect(resolveHeaderCompactState({ current: true, isDesktop: true, scrollY: 14 })).toBe(false);
});

test('mobile header still compacts earlier but keeps its own smaller hysteresis band', () => {
  expect(resolveHeaderCompactState({ current: false, isDesktop: false, scrollY: 12 })).toBe(false);
  expect(resolveHeaderCompactState({ current: false, isDesktop: false, scrollY: 72 })).toBe(true);
  expect(resolveHeaderCompactState({ current: true, isDesktop: false, scrollY: 10 })).toBe(false);
});

test('desktop header uses a continuous scroll progress instead of a binary size jump', () => {
  expect(resolveHeaderScrollProgress({ isDesktop: true, scrollY: 0 })).toBe(0);
  expect(resolveHeaderScrollProgress({ isDesktop: true, scrollY: 110 })).toBeCloseTo(0.5, 1);
  expect(resolveHeaderScrollProgress({ isDesktop: true, scrollY: 240 })).toBe(1);
});

test('mobile header reaches the compact size over a shorter scroll distance', () => {
  expect(resolveHeaderScrollProgress({ isDesktop: false, scrollY: 0 })).toBe(0);
  expect(resolveHeaderScrollProgress({ isDesktop: false, scrollY: 36 })).toBeCloseTo(0.5, 1);
  expect(resolveHeaderScrollProgress({ isDesktop: false, scrollY: 72 })).toBe(1);
});

test('mobile rest header can compute a stable text shift from actual logo and menu geometry', () => {
  const nextShift = resolveMobileBrandTextShift({
    currentShift: 0,
    plateRight: 64.0462498664856,
    textLeft: 117.48124694824219,
    textWidth: 182.89064025878906,
    menuLeft: 329.171875,
  });

  expect(nextShift).toBeCloseTo(-12.32, 2);
  expect(
    resolveMobileBrandTextShift({
      currentShift: nextShift,
      plateRight: 64.0462498664856,
      textLeft: 105.16437530517578,
      textWidth: 182.89064025878906,
      menuLeft: 329.171875,
    }),
  ).toBeCloseTo(nextShift, 2);
});

test('mobile brand text shift falls back to zero when layout metrics are invalid', () => {
  expect(
    resolveMobileBrandTextShift({
      currentShift: 14,
      plateRight: Number.NaN,
      textLeft: 12,
      textWidth: 120,
      menuLeft: 280,
    }),
  ).toBe(0);
});

test('mobile brand text shift never allows the title to jump left of the logo on very narrow widths', () => {
  const nextShift = resolveMobileBrandTextShift({
    currentShift: 0,
    plateRight: 94,
    textLeft: 126,
    textWidth: 172,
    menuLeft: 244,
  });

  const shiftedLeft = 126 + nextShift;

  expect(shiftedLeft).toBeGreaterThanOrEqual(102);
});
