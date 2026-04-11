import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('mobile services slider uses full-width cards to match extras scale', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/sections/ServicesSection.module.css'), 'utf8');

  expect(css).toContain('grid-auto-columns: 100%;');
  expect(css).toContain('min-height: 11.5rem;');
  expect(css).toContain('scroll-snap-type: x mandatory;');
  expect(css).toContain('scroll-snap-stop: always;');
});
