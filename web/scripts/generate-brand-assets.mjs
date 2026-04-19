import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(scriptDir, '..');
const sourcePath = path.join(webRoot, 'assets', 'brand-logo-source.jpg');
const publicDir = path.join(webRoot, 'public');

function isLikelyBackground(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max >= 210 && max - min <= 28;
}

async function loadMaskedLogo() {
  const { data, info } = await sharp(sourcePath)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const background = new Uint8Array(width * height);
  const stack = [];

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return;
    }

    const index = y * width + x;
    if (background[index]) {
      return;
    }

    const offset = index * channels;
    if (!isLikelyBackground(data[offset], data[offset + 1], data[offset + 2])) {
      return;
    }

    background[index] = 1;
    stack.push(index);
  };

  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }

  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }

  while (stack.length > 0) {
    const index = stack.pop();
    const x = index % width;
    const y = Math.floor(index / width);

    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let index = 0; index < background.length; index += 1) {
    const offset = index * channels;
    if (background[index]) {
      data[offset + 3] = 0;
      continue;
    }

    if (data[offset + 3] === 0) {
      continue;
    }

    const x = index % width;
    const y = Math.floor(index / width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  const pad = 18;
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const right = Math.min(width - 1, maxX + pad);
  const bottom = Math.min(height - 1, maxY + pad);

  return sharp(data, { raw: { width, height, channels } }).extract({
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  });
}

async function makeLogoBuffer(maskedLogo, size, paddingRatio, background = { r: 0, g: 0, b: 0, alpha: 0 }) {
  const innerSize = Math.round(size * (1 - paddingRatio * 2));
  const padding = Math.floor((size - innerSize) / 2);

  return maskedLogo
    .clone()
    .resize(innerSize, innerSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: padding,
      bottom: size - innerSize - padding,
      left: padding,
      right: size - innerSize - padding,
      background,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function makeIco(entries) {
  const headerSize = 6;
  const entrySize = 16;
  const directorySize = headerSize + entries.length * entrySize;
  let offset = directorySize;
  const buffers = [Buffer.alloc(directorySize)];
  const header = buffers[0];

  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  entries.forEach(({ size, buffer }, index) => {
    const entryOffset = headerSize + index * entrySize;
    header.writeUInt8(size === 256 ? 0 : size, entryOffset);
    header.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
    header.writeUInt8(0, entryOffset + 2);
    header.writeUInt8(0, entryOffset + 3);
    header.writeUInt16LE(1, entryOffset + 4);
    header.writeUInt16LE(32, entryOffset + 6);
    header.writeUInt32LE(buffer.length, entryOffset + 8);
    header.writeUInt32LE(offset, entryOffset + 12);
    buffers.push(buffer);
    offset += buffer.length;
  });

  return Buffer.concat(buffers);
}

function roundedRectSvg(width, height, radius, fill, stroke = 'none') {
  return Buffer.from(
    `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${radius}" fill="${fill}" stroke="${stroke}"/></svg>`,
  );
}

async function generateOgImage(brandLogoBuffer) {
  const ogPath = path.join(publicDir, 'og-image.png');
  const ogWebpPath = path.join(publicDir, 'og-image.webp');
  const cover = roundedRectSvg(238, 136, 26, 'rgba(255,253,248,0.94)', 'rgba(31,52,74,0.06)');
  const logo = await sharp(brandLogoBuffer)
    .resize(170, 112, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const png = await sharp(ogPath)
    .composite([
      { input: cover, left: 828, top: 50 },
      { input: logo, left: 862, top: 62 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(ogPath, png);
  await sharp(png).webp({ quality: 86, effort: 6 }).toFile(ogWebpPath);
}

async function main() {
  await mkdir(publicDir, { recursive: true });

  const maskedLogo = await loadMaskedLogo();
  const brandLogo = await makeLogoBuffer(maskedLogo, 1024, 0.2);
  const brandLogoUi = await makeLogoBuffer(maskedLogo, 384, 0.2);
  const favicon = await makeLogoBuffer(maskedLogo, 256, 0.06);
  const appleIcon = await makeLogoBuffer(maskedLogo, 180, 0.08, { r: 255, g: 253, b: 248, alpha: 1 });
  const icon192 = await makeLogoBuffer(maskedLogo, 192, 0.08, { r: 255, g: 253, b: 248, alpha: 1 });
  const icon512 = await makeLogoBuffer(maskedLogo, 512, 0.08, { r: 255, g: 253, b: 248, alpha: 1 });
  const favicon16 = await makeLogoBuffer(maskedLogo, 16, 0.04);
  const favicon32 = await makeLogoBuffer(maskedLogo, 32, 0.04);
  const favicon48 = await makeLogoBuffer(maskedLogo, 48, 0.04);

  await writeFile(path.join(publicDir, 'brand-logo.png'), brandLogo);
  await writeFile(path.join(publicDir, 'brand-logo-ui.png'), brandLogoUi);
  await sharp(brandLogo).webp({ quality: 86, effort: 6 }).toFile(path.join(publicDir, 'brand-logo.webp'));
  await sharp(brandLogoUi).webp({ quality: 86, effort: 6 }).toFile(path.join(publicDir, 'brand-logo-ui.webp'));

  await writeFile(path.join(publicDir, 'favicon.png'), favicon);
  await writeFile(path.join(publicDir, 'favicon-16.png'), favicon16);
  await writeFile(path.join(publicDir, 'favicon-32.png'), favicon32);
  await writeFile(path.join(publicDir, 'favicon-48.png'), favicon48);
  await sharp(favicon).webp({ quality: 86, effort: 6 }).toFile(path.join(publicDir, 'favicon.webp'));
  await writeFile(path.join(publicDir, 'favicon.ico'), makeIco([
    { size: 16, buffer: favicon16 },
    { size: 32, buffer: favicon32 },
    { size: 48, buffer: favicon48 },
  ]));

  await writeFile(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);
  await writeFile(path.join(publicDir, 'icon-192.png'), icon192);
  await writeFile(path.join(publicDir, 'icon-512.png'), icon512);

  for (const candidate of ['favicon-candidate', 'favicon-candidate-2', 'favicon-candidate-3']) {
    await writeFile(path.join(publicDir, `${candidate}.png`), favicon);
    await sharp(favicon).webp({ quality: 86, effort: 6 }).toFile(path.join(publicDir, `${candidate}.webp`));
  }

  await writeFile(
    path.join(publicDir, 'site.webmanifest'),
    `${JSON.stringify(
      {
        name: 'Праздник каждый день',
        short_name: 'Праздник',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        theme_color: '#fffdf8',
        background_color: '#fffdf8',
        display: 'standalone',
      },
      null,
      2,
    )}\n`,
  );

  await generateOgImage(favicon);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
