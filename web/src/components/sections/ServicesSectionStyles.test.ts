import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('services keeps the mobile slider while using a fixed media aspect ratio', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/sections/ServicesSection.module.css'), 'utf8');

  expect(css).toContain('grid-auto-columns: 100%;');
  expect(css).toContain('aspect-ratio: 5 / 4;');
  expect(css).toContain('scroll-snap-type: x mandatory;');
  expect(css).toContain('scroll-snap-stop: always;');
  expect(css).toContain('object-fit: contain;');
});
