import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(webRoot, '..');
const sourceRoot = path.join(repoRoot, 'правкиии');
const outputRoot = path.join(webRoot, 'public', 'images', 'service-galleries');
const manifestPath = path.join(webRoot, 'src', 'content', 'serviceGalleries.generated.ts');
const SIZES = '(max-width: 720px) 74vw, (max-width: 1120px) 34vw, 18rem';
const BREAKPOINTS = [480, 720, 960];
const PLACEHOLDER_WIDTH = 1200;
const PLACEHOLDER_HEIGHT = 900;

function folder(name, options = {}) {
  return { type: 'folder', name, ...options };
}

function existing(slug, options = {}) {
  return { type: 'existing', slug, ...options };
}

function placeholder(count) {
  return { type: 'placeholder', count };
}

const gallerySources = [
  { slug: 'cotton-candy', name: 'Сахарная вата', sources: [folder('вата')] },
  {
    slug: 'popcorn',
    name: 'Попкорн',
    sources: [folder('попкорн', { excludeNames: ['photo_2026-04-15_11-46-10.jpg'] })],
  },
  { slug: 'cotton-candy-popcorn', name: 'Сахарная вата + попкорн', sources: [folder('попкорн и вата')] },
  { slug: 'caramel-apples', name: 'Карамельные яблоки', sources: [existing('caramel-apples', { indices: [1, 2] }), folder('яблоки')] },
  { slug: 'roll-ice-cream', name: 'Ролл-мороженое', sources: [existing('roll-ice-cream', { indices: [1, 2, 3, 4] }), folder('ролл')] },
  { slug: 'scoop-ice-cream', name: 'Шариковое мороженое', sources: [existing('scoop-ice-cream', { indices: [1, 2, 4] }), folder('шариковое')] },
  { slug: 'nitro-ice-cream', name: 'Азотное мороженое', sources: [folder('nitro-ice-cream')] },
  { slug: 'chocolate-fountain', name: 'Шоколадный фонтан', sources: [folder('фонтан')] },
  {
    slug: 'french-hot-dog',
    name: 'Французский хот-дог',
    sources: [folder('хотдог', { excludeNames: ['photo_2026-04-15_12-09-20.jpg'] })],
  },
  {
    slug: 'danish-hot-dog',
    name: 'Датский хот-дог',
    sources: [folder('хотдог', { excludeNames: ['photo_2026-04-15_12-09-20.jpg'] })],
  },
  { slug: 'burgers', name: 'Бургеры', sources: [folder('бургеры')] },
  { slug: 'belgian-waffles', name: 'Бельгийские вафли', sources: [existing('belgian-waffles', { indices: [1, 2] }), folder('вафли')] },
  { slug: 'pancakes', name: 'Блины', sources: [existing('pancakes', { indices: [1] }), folder('блины'), existing('pancakes', { indices: [3] })] },
  { slug: 'champagne-pyramid', name: 'Пирамида из шампанского', sources: [existing('champagne-pyramid', { indices: [1, 2, 3] }), folder('пирамида')] },
  { slug: 'craft-lemonade', name: 'Крафтовый лимонад', sources: [folder('лимонады')] },
  { slug: 'branded-cart', name: 'Брендирование тележки для кейтеринга', sources: [folder('брендирование телег')] },
  { slug: 'equipment-rental', name: 'Аренда оборудования', sources: [placeholder(4)] },
  { slug: 'cart-rental', name: 'Аренда тележек', sources: [folder('брендирование телег')] },
  { slug: 'tea-station', name: 'Чайная станция', sources: [folder('чайная станция')] },
  { slug: 'bubble-tea', name: 'Бабл ти', sources: [folder('баблти')] },
  { slug: 'plov-station', name: 'Станция плова', sources: [existing('plov-station', { indices: [1, 2] })] },
];

gallerySources.splice(
  gallerySources.findIndex((entry) => entry.slug === 'chocolate-fountain'),
  0,
  { slug: 'foam-cannon', name: 'Пенная пушка', sources: [folder('пушка')] },
);

const equipmentRentalGallery = gallerySources.find((entry) => entry.slug === 'equipment-rental');
if (equipmentRentalGallery) {
  equipmentRentalGallery.sources = [folder('аренда оборудования')];
}

function quote(value) {
  return JSON.stringify(value);
}

function roundDimension(width, height, targetWidth) {
  return Math.max(1, Math.round((height / width) * targetWidth));
}

async function listImageFiles(folderPath, options = {}) {
  const entries = await readdir(folderPath, { withFileTypes: true });
  const excludeNames = new Set((options.excludeNames ?? []).map((name) => name.toLowerCase()));

  return entries
    .filter((entry) => entry.isFile() && /\.(jpe?g|png)$/i.test(entry.name))
    .filter((entry) => !excludeNames.has(entry.name.toLowerCase()))
    .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
    .map((entry) => path.join(folderPath, entry.name));
}

async function resolveSourceFolderPath(folderName) {
  const candidatePath = path.join(sourceRoot, folderName);
  await readdir(candidatePath);
  return candidatePath;
}

function parseOriginalIndex(fileName) {
  const match = /^image-(\d+)-original\./i.exec(fileName);
  return match ? Number.parseInt(match[1], 10) : undefined;
}

function listGitOriginalEntries(slug) {
  const gitPath = `web/public/images/service-galleries/${slug}`;
  const output = execFileSync('git', ['ls-tree', '-r', '--name-only', 'HEAD', gitPath], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  return output
    .split(/\r?\n/u)
    .filter(Boolean)
    .filter((entry) => /^web\/public\/images\/service-galleries\/[^/]+\/image-\d+-original\.(jpe?g|png)$/iu.test(entry));
}

function filterOriginalEntries(entries, source) {
  const wantedIndices = new Set(source.indices ?? []);
  const excludedIndices = new Set(source.excludeIndices ?? []);

  return entries.filter((entry) => {
    const fileName = typeof entry === 'string' ? path.basename(entry) : entry.name;
    const index = parseOriginalIndex(fileName);

    if (index === undefined) {
      return false;
    }

    if (wantedIndices.size > 0) {
      return wantedIndices.has(index);
    }

    return !excludedIndices.has(index);
  });
}

async function collectExistingFiles(source, tempRoot) {
  const existingDir = path.join(outputRoot, source.slug);
  const tempDir = path.join(tempRoot, source.slug);
  await mkdir(tempDir, { recursive: true });

  const copiedFiles = [];
  try {
    const entries = await readdir(existingDir, { withFileTypes: true });
    const files = filterOriginalEntries(
      entries.filter((entry) => entry.isFile() && /^image-\d+-original\.(jpe?g|png)$/i.test(entry.name)),
      source,
    ).sort((left, right) => left.name.localeCompare(right.name, 'ru'));

    for (const entry of files) {
      const sourcePath = path.join(existingDir, entry.name);
      const tempPath = path.join(tempDir, entry.name);

      await copyFile(sourcePath, tempPath);
      copiedFiles.push(tempPath);
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code !== 'ENOENT') {
      throw error;
    }
  }

  if (copiedFiles.length > 0) {
    return copiedFiles;
  }

  const gitEntries = filterOriginalEntries(listGitOriginalEntries(source.slug), source).sort((left, right) =>
    left.localeCompare(right, 'ru'),
  );

  for (const gitEntry of gitEntries) {
    const tempPath = path.join(tempDir, path.basename(gitEntry));
    const fileBuffer = execFileSync('git', ['show', `HEAD:${gitEntry}`], {
      cwd: repoRoot,
      encoding: 'buffer',
      maxBuffer: 16 * 1024 * 1024,
    });

    await writeFile(tempPath, fileBuffer);
    copiedFiles.push(tempPath);
  }

  return copiedFiles;
}

async function fileHash(filePath) {
  return createHash('sha256').update(await readFile(filePath)).digest('hex');
}

async function dedupeFiles(files) {
  const seenHashes = new Set();
  const dedupedFiles = [];

  for (const filePath of files) {
    const hash = await fileHash(filePath);

    if (seenHashes.has(hash)) {
      continue;
    }

    seenHashes.add(hash);
    dedupedFiles.push(filePath);
  }

  return dedupedFiles;
}

async function collectInputFiles(sources, tempRoot) {
  const files = [];

  for (const source of sources) {
    if (source.type === 'folder') {
      files.push(...(await listImageFiles(await resolveSourceFolderPath(source.name), source)));
      continue;
    }

    if (source.type === 'existing') {
      files.push(...(await collectExistingFiles(source, tempRoot)));
    }
  }

  return dedupeFiles(files);
}

function getPlaceholderSvg(name) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PLACEHOLDER_WIDTH} ${PLACEHOLDER_HEIGHT}" role="img" aria-labelledby="title desc">
  <title id="title">${name}</title>
  <desc id="desc">Временное белое изображение для галереи.</desc>
  <rect width="${PLACEHOLDER_WIDTH}" height="${PLACEHOLDER_HEIGHT}" rx="48" fill="#ffffff" />
</svg>
`;
}

async function createFallback(inputPath, outputPath, width, hasAlpha) {
  const pipeline = sharp(inputPath).rotate().resize({ width, withoutEnlargement: true });

  if (hasAlpha) {
    await pipeline.png({ compressionLevel: 9, palette: true }).toFile(outputPath);
    return;
  }

  await pipeline.jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(outputPath);
}

async function createWebpVariant(inputPath, outputPath, width) {
  await sharp(inputPath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 86, effort: 6 })
    .toFile(outputPath);
}

async function buildImageEntries(service, inputFiles, serviceOutputDir) {
  const images = [];

  for (const [index, inputPath] of inputFiles.entries()) {
    const metadata = await sharp(inputPath).rotate().metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error(`Не удалось определить размеры изображения: ${inputPath}`);
    }

    const targetWidth = Math.min(metadata.width, 960);
    const targetHeight = roundDimension(metadata.width, metadata.height, targetWidth);
    const variantWidths = [...new Set([...BREAKPOINTS.filter((width) => width < targetWidth), targetWidth])];
    const baseName = `image-${String(index + 1).padStart(2, '0')}`;
    const hasAlpha = metadata.hasAlpha === true;
    const originalExtension = path.extname(inputPath).toLowerCase();
    const originalFileName = `${baseName}-original${originalExtension}`;
    const originalOutputPath = path.join(serviceOutputDir, originalFileName);
    const fallbackExtension = hasAlpha ? 'png' : 'jpg';
    const fallbackFileName = `${baseName}.${fallbackExtension}`;
    const fallbackOutputPath = path.join(serviceOutputDir, fallbackFileName);
    const srcSetEntries = [];

    await copyFile(inputPath, originalOutputPath);
    await createFallback(inputPath, fallbackOutputPath, targetWidth, hasAlpha);

    for (const variantWidth of variantWidths) {
      const webpFileName = `${baseName}-${variantWidth}.webp`;
      const webpOutputPath = path.join(serviceOutputDir, webpFileName);

      await createWebpVariant(inputPath, webpOutputPath, variantWidth);
      srcSetEntries.push(`/images/service-galleries/${service.slug}/${webpFileName} ${variantWidth}w`);
    }

    images.push({
      id: `${service.slug}-${baseName}`,
      src: `/images/service-galleries/${service.slug}/${fallbackFileName}`,
      originalSrc: `/images/service-galleries/${service.slug}/${originalFileName}`,
      webpSrcSet: srcSetEntries.join(', '),
      sizes: SIZES,
      width: targetWidth,
      height: targetHeight,
      originalWidth: metadata.width,
      originalHeight: metadata.height,
      alt: `${service.name} — фото ${index + 1}`,
    });
  }

  return images;
}

async function buildPlaceholderEntries(service, count, serviceOutputDir) {
  const placeholderFileName = 'placeholder-white.svg';

  await writeFile(path.join(serviceOutputDir, placeholderFileName), getPlaceholderSvg(service.name), 'utf8');

  return Array.from({ length: count }, (_, index) => ({
    id: `${service.slug}-image-${String(index + 1).padStart(2, '0')}`,
    src: `/images/service-galleries/${service.slug}/${placeholderFileName}`,
    originalSrc: `/images/service-galleries/${service.slug}/${placeholderFileName}`,
    webpSrcSet: '',
    sizes: SIZES,
    width: PLACEHOLDER_WIDTH,
    height: PLACEHOLDER_HEIGHT,
    originalWidth: PLACEHOLDER_WIDTH,
    originalHeight: PLACEHOLDER_HEIGHT,
    alt: `${service.name} — плейсхолдер ${index + 1}`,
  }));
}

function pushManifestEntry(manifestEntries, service, images) {
  manifestEntries.push(`  ${quote(service.slug)}: [`);
  for (const image of images) {
    manifestEntries.push('    {');
    manifestEntries.push(`      id: ${quote(image.id)},`);
    manifestEntries.push(`      src: ${quote(image.src)},`);
    manifestEntries.push(`      originalSrc: ${quote(image.originalSrc)},`);
    manifestEntries.push(`      webpSrcSet: ${quote(image.webpSrcSet)},`);
    manifestEntries.push(`      sizes: ${quote(image.sizes)},`);
    manifestEntries.push(`      width: ${image.width},`);
    manifestEntries.push(`      height: ${image.height},`);
    manifestEntries.push(`      originalWidth: ${image.originalWidth},`);
    manifestEntries.push(`      originalHeight: ${image.originalHeight},`);
    manifestEntries.push(`      alt: ${quote(image.alt)},`);
    manifestEntries.push('    },');
  }
  manifestEntries.push('  ],');
}

async function buildManifest() {
  const tempRoot = await mkdtemp(path.join(tmpdir(), 'party-service-galleries-'));

  try {
    const resolvedSources = [];
    for (const service of gallerySources) {
      const placeholderSource = service.sources.find((source) => source.type === 'placeholder');

      resolvedSources.push({
        service,
        placeholderCount: placeholderSource?.count ?? 0,
        inputFiles: placeholderSource ? [] : await collectInputFiles(service.sources, tempRoot),
      });
    }

    await rm(outputRoot, { recursive: true, force: true });
    await mkdir(outputRoot, { recursive: true });

    const manifestEntries = [];

    for (const { service, placeholderCount, inputFiles } of resolvedSources) {
      const serviceOutputDir = path.join(outputRoot, service.slug);
      await mkdir(serviceOutputDir, { recursive: true });

      const images =
        placeholderCount > 0
          ? await buildPlaceholderEntries(service, placeholderCount, serviceOutputDir)
          : await buildImageEntries(service, inputFiles, serviceOutputDir);

      pushManifestEntry(manifestEntries, service, images);
    }

    const manifest = `export type ServiceGalleryImage = {
  id: string;
  src: string;
  originalSrc: string;
  webpSrcSet: string;
  sizes: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  alt: string;
};

export const serviceGalleries: Partial<Record<string, ServiceGalleryImage[]>> = {
${manifestEntries.join('\n')}
};
`;

    await writeFile(manifestPath, manifest, 'utf8');
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

buildManifest().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
