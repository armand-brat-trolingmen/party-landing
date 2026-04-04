import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { SITE_URL, withSiteUrl } from './site.config.js';

const projectRoot = process.cwd();
const srcRoot = resolve(projectRoot, 'src');
const distRoot = resolve(projectRoot, 'dist');
const sitemapPath = resolve(distRoot, 'sitemap.xml');
const robotsSourcePath = resolve(projectRoot, 'public', 'robots.txt');
const robotsDistPath = resolve(distRoot, 'robots.txt');
const distIndexPath = resolve(distRoot, 'index.html');
const appRoutesPath = resolve(srcRoot, 'AppRoutes.tsx');
const indexableExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);
const technicalPattern = /(404|500|notfound|error|fallback)/i;
const policyPattern = /(privacy|policy|terms|legal)/i;

function normalizeRoutePath(route) {
  if (!route || route === '*' || route.includes(':')) {
    return null;
  }

  const trimmed = route.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed === '/' || trimmed === 'index') {
    return '/';
  }

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return normalized.replace(/\/+$/, '') || '/';
}

function isIndexableRoute(route) {
  return Boolean(route) && !technicalPattern.test(route);
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

async function walkRouteFiles(directory, baseDirectory = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const routes = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      routes.push(...(await walkRouteFiles(fullPath, baseDirectory)));
      continue;
    }

    const extension = extname(entry.name);
    if (!indexableExtensions.has(extension)) {
      continue;
    }

    const relativePath = relative(baseDirectory, fullPath).replace(/\\/g, '/');
    const normalized = relativePath.slice(0, -extension.length).replace(/\/index$/i, '').replace(/^index$/i, '');
    const route = normalizeRoutePath(normalized);

    if (isIndexableRoute(route)) {
      routes.push(route);
    }
  }

  return routes;
}

async function collectRoutesFromPageDirs() {
  const candidates = ['pages', 'routes'];
  const routes = [];

  for (const candidate of candidates) {
    const candidatePath = resolve(srcRoot, candidate);
    if (!existsSync(candidatePath)) {
      continue;
    }

    const candidateStat = await stat(candidatePath);
    if (!candidateStat.isDirectory()) {
      continue;
    }

    routes.push(...(await walkRouteFiles(candidatePath)));
  }

  return routes;
}

async function collectRoutesFromAppRoutes() {
  if (!existsSync(appRoutesPath)) {
    return [];
  }

  const source = await readFile(appRoutesPath, 'utf8');
  const matches = [...source.matchAll(/path\s*=\s*["'`](.*?)["'`]/g)];

  return matches
    .map((match) => normalizeRoutePath(match[1]))
    .filter(isIndexableRoute);
}

async function detectIndexableRoutes() {
  const routes = new Set(['/']);

  for (const route of await collectRoutesFromPageDirs()) {
    routes.add(route);
  }

  for (const route of await collectRoutesFromAppRoutes()) {
    routes.add(route);
  }

  return [...routes].filter(isIndexableRoute).sort((left, right) => {
    if (left === '/') return -1;
    if (right === '/') return 1;
    return left.localeCompare(right);
  });
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

  const routes = await detectIndexableRoutes();
  const sitemap = buildSitemapXml(routes);

  await writeFile(sitemapPath, sitemap, 'utf8');
  await ensureRobotsFile();
  await patchFileWithSiteUrl(distIndexPath);

  console.log(`[sitemap] site url: ${SITE_URL}`);
  console.log(`[sitemap] found ${routes.length} URL(s)`);
  for (const route of routes) {
    console.log(`[sitemap] include ${route}`);
  }
  console.log(`[sitemap] written to ${sitemapPath}`);
  if (existsSync(robotsDistPath)) {
    console.log(`[robots] written to ${robotsDistPath}`);
  }
}

await main();
