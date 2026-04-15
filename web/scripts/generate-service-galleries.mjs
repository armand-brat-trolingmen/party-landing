import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(webRoot, '..');
const sourceRoot = path.join(repoRoot, 'правки');
const outputRoot = path.join(webRoot, 'public', 'images', 'service-galleries');
const manifestPath = path.join(webRoot, 'src', 'content', 'serviceGalleries.generated.ts');
const SIZES = '(max-width: 720px) 74vw, (max-width: 1120px) 34vw, 18rem';
const BREAKPOINTS = [480, 720, 960];

const gallerySources = [
  { slug: 'cotton-candy', name: 'Сахарная вата', folders: ['вата'] },
  { slug: 'popcorn', name: 'Попкорн', folders: ['попкорн'] },
  { slug: 'cotton-candy-popcorn', name: 'Сахарная вата + попкорн', folders: ['вата', 'попкорн'] },
  { slug: 'caramel-apples', name: 'Карамельные яблоки', folders: ['яблоки'] },
  { slug: 'roll-ice-cream', name: 'Мороженое (Ролл)', folders: ['ролл'] },
  { slug: 'scoop-ice-cream', name: 'Мороженое (Шариковое)', folders: ['шариковое'] },
  { slug: 'nitro-ice-cream', name: 'Мороженое (Азотное)', folders: ['азотное'] },
  { slug: 'chocolate-fountain', name: 'Шоколадный фонтан', folders: ['фонтан'] },
  { slug: 'belgian-waffles', name: 'Бельгийские вафли', folders: ['вафли'] },
  { slug: 'pancakes', name: 'Блины', folders: ['блины'] },
  { slug: 'champagne-pyramid', name: 'Пирамида из шампанского', folders: ['шампанское'] },
  { slug: 'craft-lemonade', name: 'Крафтовый лимонад', folders: ['лимонад'] },
  { slug: 'bubble-tea', name: 'Бабл ти', folders: ['баблти'] },
];

function quote(value) {
  return JSON.stringify(value);
}

function roundDimension(width, height, targetWidth) {
  return Math.max(1, Math.round((height / width) * targetWidth));
}

async function collectSourceFiles(folders) {
  const files = [];

  for (const folder of folders) {
    const folderPath = path.join(sourceRoot, folder);
    const entries = await readdir(folderPath, { withFileTypes: true });

    const folderFiles = entries
      .filter((entry) => entry.isFile() && /\.(jpe?g|png)$/i.test(entry.name))
      .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
      .map((entry) => path.join(folderPath, entry.name));

    files.push(...folderFiles);
  }

  return files;
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

async function buildManifest() {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  const manifestEntries = [];

  for (const service of gallerySources) {
    const inputFiles = await collectSourceFiles(service.folders);
    const serviceOutputDir = path.join(outputRoot, service.slug);

    await mkdir(serviceOutputDir, { recursive: true });

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
      const fallbackExtension = hasAlpha ? 'png' : 'jpg';
      const fallbackFileName = `${baseName}.${fallbackExtension}`;
      const fallbackOutputPath = path.join(serviceOutputDir, fallbackFileName);
      const srcSetEntries = [];

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
        webpSrcSet: srcSetEntries.join(', '),
        sizes: SIZES,
        width: targetWidth,
        height: targetHeight,
        alt: `${service.name} — фото ${index + 1}`,
      });
    }

    manifestEntries.push(`  ${quote(service.slug)}: [`);
    for (const image of images) {
      manifestEntries.push('    {');
      manifestEntries.push(`      id: ${quote(image.id)},`);
      manifestEntries.push(`      src: ${quote(image.src)},`);
      manifestEntries.push(`      webpSrcSet: ${quote(image.webpSrcSet)},`);
      manifestEntries.push(`      sizes: ${quote(image.sizes)},`);
      manifestEntries.push(`      width: ${image.width},`);
      manifestEntries.push(`      height: ${image.height},`);
      manifestEntries.push(`      alt: ${quote(image.alt)},`);
      manifestEntries.push('    },');
    }
    manifestEntries.push('  ],');
  }

  const manifest = `export type ServiceGalleryImage = {
  id: string;
  src: string;
  webpSrcSet: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
};

export const serviceGalleries: Partial<Record<string, ServiceGalleryImage[]>> = {
${manifestEntries.join('\n')}
};
`;

  await writeFile(manifestPath, manifest, 'utf8');
}

buildManifest().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
