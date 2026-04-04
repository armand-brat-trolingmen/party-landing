import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('index html keeps an app-html placeholder inside the root mount point', () => {
  const template = readFileSync(resolve(import.meta.dirname, '../index.html'), 'utf8');

  expect(template).toContain('<div id="root"><!--app-html--></div>');
});
