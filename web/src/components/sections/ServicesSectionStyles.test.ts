import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('mobile services slider uses hard snap points and wider cards to avoid half-snapped states', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/sections/ServicesSection.module.css'), 'utf8');

  expect(css).toContain('grid-auto-columns: clamp(8.9rem, 44vw, 10.4rem);');
  expect(css).toContain('scroll-snap-type: x mandatory;');
  expect(css).toContain('scroll-snap-stop: always;');
});
