import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('circular gallery uses native scrolling on coarse mobile pointers and wheel support on desktop canvas', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/components/sections/CircularGallery.tsx'), 'utf8');

  expect(source).toContain("window.matchMedia?.('(pointer: coarse)').matches");
  expect(source).toContain("window.matchMedia?.('(max-width: 900px)').matches");
  expect(source).toContain('function handleWheel(event: WheelEvent)');
  expect(source).toContain("stageElement.addEventListener('wheel', handleWheel, { passive: false });");
  expect(source).toContain("stageElement.removeEventListener('wheel', handleWheel);");
});
