import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('circular gallery keeps wheel-driven desktop canvas but bails out on major WebGL performance caveats', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/components/sections/CircularGallery.tsx'), 'utf8');

  expect(source).toContain("window.matchMedia?.('(pointer: coarse)').matches");
  expect(source).toContain("window.matchMedia?.('(max-width: 900px)').matches");
  expect(source).toContain('failIfMajorPerformanceCaveat: true');
  expect(source).toContain('vec2 coverUv');
  expect(source).not.toContain('vec2 containUv');
  expect(source).not.toContain('vec4(0.9608, 0.8863, 0.8078, 1.0)');
  expect(source).toContain('function handleWheel(event: WheelEvent)');
  expect(source).toContain("stageElement.addEventListener('wheel', handleWheel, { passive: false });");
  expect(source).toContain("stageElement.removeEventListener('wheel', handleWheel);");
});
