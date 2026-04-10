import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory);
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      files.push(...collectSourceFiles(absolutePath));
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith('.test.ts') && !entry.endsWith('.test.tsx')) {
      files.push(absolutePath);
    }
  }

  return files;
}

const sourceRoots = ['src/components', 'src/pages'];

test('content consumers no longer import from legacy data modules', () => {
  const files = sourceRoots.flatMap((root) => collectSourceFiles(resolve(process.cwd(), root)));

  for (const file of files) {
    const code = readFileSync(file, 'utf8');
    const displayPath = relative(process.cwd(), file).replaceAll('\\', '/');
    expect(code, displayPath).not.toMatch(/data\/siteContent|data\/catalogContent|data\/footerContent/);
  }
});
