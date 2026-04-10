import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { createServer } from 'vite';

const projectRoot = process.cwd();
const pagesDir = resolve(projectRoot, 'src/pages');
const sourceTemplatePath = resolve(projectRoot, 'index.html');
const distDir = resolve(projectRoot, 'dist');
const distTemplatePath = resolve(distDir, 'index.html');
const PAGE_PATTERN = /\.(jsx?|tsx?)$/;
const TEST_FILE_PATTERN = /\.(test|spec)\.(jsx?|tsx?)$/;
const DYNAMIC_ENTRY_BASENAMES = new Set(['service', 'extra']);

async function walkPages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkPages(fullPath)));
      continue;
    }

    if (!PAGE_PATTERN.test(entry.name) || TEST_FILE_PATTERN.test(entry.name)) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function filePathToUrl(filePath) {
  const relativePath = relative(pagesDir, filePath).replace(/\\/g, '/');
  const normalized = relativePath.slice(0, -extname(relativePath).length);

  if (DYNAMIC_ENTRY_BASENAMES.has(normalized.split('/').pop() ?? '')) {
    return null;
  }

  const trimmedIndex = normalized.replace(/\/index$/i, '').replace(/^index$/i, '');

  if (!trimmedIndex) {
    return '/';
  }

  return `/${trimmedIndex}`;
}

function injectAppHtml(template, appHtml) {
  if (template.includes('<!--app-html-->')) {
    return template.replace('<!--app-html-->', appHtml);
  }

  return template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

function injectHeadTag(template, placeholder, content) {
  if (template.includes(placeholder)) {
    return template.replace(placeholder, content);
  }

  if (!content) {
    return template;
  }

  return template.replace('</head>', `${content}\n  </head>`);
}

function injectHelmetHead(template, helmet) {
  let html = template;

  html = injectHeadTag(html, '<!--helmet-title-->', helmet.title);
  html = injectHeadTag(html, '<!--helmet-meta-->', helmet.meta);
  html = injectHeadTag(html, '<!--helmet-link-->', helmet.link);
  html = injectHeadTag(html, '<!--helmet-script-->', helmet.script);

  return html;
}

function validateRenderedHtml(url, baseTemplate, html) {
  if (!html.trim()) {
    throw new Error(`SSG produced an empty HTML document for "${url}".`);
  }

  const rootMatch = html.match(/<div id="root"[^>]*>([\s\S]*?)<\/div>/i);

  if (!rootMatch || !rootMatch[1].trim()) {
    throw new Error(`SSG root is empty for "${url}".`);
  }

  if (html.length <= baseTemplate.length) {
    throw new Error(`SSG output for "${url}" is not larger than the base template.`);
  }
}

async function resolvePageUrls(vite) {
  try {
    const pageFiles = await walkPages(pagesDir);
    const staticUrls = pageFiles.map(filePathToUrl).filter(Boolean);
    const { getAllOfferingUrls } = await vite.ssrLoadModule('/src/content/index.ts');
    const dynamicUrls = typeof getAllOfferingUrls === 'function' ? getAllOfferingUrls() : [];
    const urls = [...new Set([...staticUrls, ...dynamicUrls])].sort();

    return urls.length > 0 ? urls : ['/'];
  } catch (error) {
    console.warn('[ssg] src/pages scan failed, falling back to root route.');
    console.warn(error);
    return ['/'];
  }
}

function getTargetFile(url) {
  if (url === '/') {
    return resolve(distDir, 'index.html');
  }

  const segments = url.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  return resolve(distDir, ...segments, 'index.html');
}

async function writeRouteHtml(url, html) {
  const targetFile = getTargetFile(url);
  await mkdir(dirname(targetFile), { recursive: true });
  await writeFile(targetFile, html, 'utf8');
}

async function prerender() {
  const template = await readFile(distTemplatePath, 'utf8').catch(() => readFile(sourceTemplatePath, 'utf8'));
  const vite = await createServer({
    appType: 'custom',
    configFile: resolve(projectRoot, 'vite.config.ts'),
    logLevel: 'error',
    server: { middlewareMode: true },
  });
  const urls = await resolvePageUrls(vite);

  let failed = false;

  try {
    const serverEntry = await vite.ssrLoadModule('/src/entry-server.tsx');

    if (typeof serverEntry.render !== 'function') {
      throw new Error('entry-server.tsx must export render(url: string): string');
    }

    for (const url of urls) {
      try {
        const renderResult = serverEntry.render(url);
        const appHtml = typeof renderResult === 'string' ? renderResult : renderResult.appHtml;
        const helmet =
          typeof renderResult === 'string'
            ? { title: '', meta: '', link: '', script: '' }
            : renderResult.helmet;
        const html = injectHelmetHead(injectAppHtml(template, appHtml), helmet);

        validateRenderedHtml(url, template, html);
        await writeRouteHtml(url, html);
        console.log(`[ssg] prerendered ${url}`);
      } catch (routeError) {
        failed = true;
        console.error(`[ssg] failed to prerender ${url}`);
        console.error(routeError);
      }
    }
  } catch (error) {
    failed = true;
    console.error('[ssg] fatal prerender error');
    console.error(error);
  } finally {
    await vite.close();
  }

  if (failed) {
    process.exitCode = 1;
  }
}

await prerender();
