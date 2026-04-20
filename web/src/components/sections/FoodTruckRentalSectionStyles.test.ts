import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('food truck rental gallery keeps full photos without crop, masonry gaps, or beige frames', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/sections/FoodTruckRentalSection.module.css'), 'utf8');

  expect(css).toContain('columns: 2 18rem;');
  expect(css).toContain('break-inside: avoid;');
  expect(css).toContain('height: auto;');
  expect(css).toContain('box-shadow: 0 18px 34px rgba(31, 52, 74, 0.12);');
  expect(css).not.toContain('background: #f5e2ce;');
  expect(css).not.toContain('aspect-ratio: 16 / 10;');
  expect(css).not.toContain('aspect-ratio: var(--photo-aspect, 16 / 10);');
  expect(css).not.toContain('object-fit: cover;');
  expect(css).toMatch(/@media \(max-width: 720px\) \{[\s\S]*?\.photoGrid \{[\s\S]*?columns: 1;/);
});
