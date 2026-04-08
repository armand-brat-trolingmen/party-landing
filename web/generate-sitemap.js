import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { SITE_URL, withSiteUrl } from './site.config.js';

const projectRoot = process.cwd();
const distRoot = resolve(projectRoot, 'dist');
const sitemapPath = resolve(distRoot, 'sitemap.xml');
const robotsSourcePath = resolve(projectRoot, 'public', 'robots.txt');
const robotsDistPath = resolve(distRoot, 'robots.txt');
const distIndexPath = resolve(distRoot, 'index.html');
const technicalPattern = /(404|500|notfound|error|fallback)/i;
const policyPattern = /(privacy|policy|terms|legal|consent)/i;

function normalizeRoutePath(route) {
  const trimmed = route.trim();

  if (!trimmed || trimmed === '/') {
    return '/';
  }

  return `/${trimmed.replace(/^\/+/, '').replace(/\/+$/, '')}`;
}

function isIndexableRoute(route) {
  return Boolean(route) && !technicalPattern.test(route) && !route.includes('.test');
}

function getRouteMeta(route) {
  if (route === '/') {
    return { changefreq: 'weekly', priority: '1.0' };
  }

  if (policyPattern.test(route)) {
    return { changefreq: 'yearly', priority: '0.5' };
  }

  return { changefreq: 'monthly', priority: '0.8' };
}

async function walkDist(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const routes = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      routes.push(...(await walkDist(fullPath)));
      continue;
    }

    if (!entry.isFile() || entry.name !== 'index.html') {
      continue;
    }

    const relativeDir = relative(distRoot, dirname(fullPath)).replace(/\\/g, '/');
    const route = normalizeRoutePath(relativeDir === '.' ? '/' : relativeDir);

    if (isIndexableRoute(route)) {
      routes.push(route);
    }
  }

  return routes;
}

function buildSitemapXml(routes) {
  const lastmod = new Date().toISOString();
  const urls = routes
    .map((route) => {
      const { changefreq, priority } = getRouteMeta(route);
      const location = route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`;

      return [
        '  <url>',
        `    <loc>${location}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}

async function patchFileWithSiteUrl(filePath) {
  if (!existsSync(filePath)) {
    return false;
  }

  const current = await readFile(filePath, 'utf8');
  const next = withSiteUrl(current);

  if (next !== current) {
    await writeFile(filePath, next, 'utf8');
  }

  return true;
}

async function ensureRobotsFile() {
  if (!existsSync(robotsSourcePath)) {
    return;
  }

  const source = await readFile(robotsSourcePath, 'utf8');
  await mkdir(dirname(robotsDistPath), { recursive: true });
  await writeFile(robotsDistPath, withSiteUrl(source), 'utf8');
}

async function main() {
  await mkdir(distRoot, { recursive: true });

  const routes = [...new Set(await walkDist(distRoot))].sort((left, right) => {
    if (left === '/') return -1;
    if (right === '/') return 1;
    return left.localeCompare(right);
  });
  const sitemap = buildSitemapXml(routes.length > 0 ? routes : ['/']);

  await writeFile(sitemapPath, sitemap, 'utf8');
  await ensureRobotsFile();
  await patchFileWithSiteUrl(distIndexPath);

  console.log(`[sitemap] site url: ${SITE_URL}`);
  console.log(`[sitemap] found ${routes.length > 0 ? routes.length : 1} URL(s)`);
  for (const route of routes.length > 0 ? routes : ['/']) {
    console.log(`[sitemap] include ${route}`);
  }
  console.log(`[sitemap] written to ${sitemapPath}`);
  if (existsSync(robotsDistPath)) {
    console.log(`[robots] written to ${robotsDistPath}`);
  }
}

await main();
