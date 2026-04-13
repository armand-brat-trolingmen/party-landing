import { resolveHeaderCompactState, resolveHeaderScrollProgress } from './SiteHeaderScrollState';

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
