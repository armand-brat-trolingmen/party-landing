import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(scriptDir, '..');
const sourcePath = path.join(webRoot, 'assets', 'brand-logo-source.jpg');
const badgeSourcePath = path.join(webRoot, 'assets', 'brand-logo-badge-source.png');
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

function getAlphaBounds(data, width, height, channels) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let index = 0; index < width * height; index += 1) {
    const alpha = data[index * channels + 3];

    if (alpha === 0) {
      continue;
    }

    const x = index % width;
    const y = Math.floor(index / width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  if (maxX < 0 || maxY < 0) {
    throw new Error('Source image is fully transparent and cannot be used for brand assets.');
  }

  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

async function loadTrimmedAlphaImage(inputPath, pad = 12) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const bounds = getAlphaBounds(data, width, height, channels);
  const left = Math.max(0, bounds.left - pad);
  const top = Math.max(0, bounds.top - pad);
  const right = Math.min(width - 1, bounds.left + bounds.width - 1 + pad);
  const bottom = Math.min(height - 1, bounds.top + bounds.height - 1 + pad);

  return sharp(data, { raw: { width, height, channels } }).extract({
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  });
}

async function makeLogoBuffer(
  maskedLogo,
  size,
  paddingRatio,
  background = { r: 0, g: 0, b: 0, alpha: 0 },
  flattenOnBackground = false,
) {
  const innerSize = Math.round(size * (1 - paddingRatio * 2));
  const padding = Math.floor((size - innerSize) / 2);
  let pipeline = maskedLogo.clone().resize(innerSize, innerSize, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  if (flattenOnBackground && background.alpha > 0) {
    pipeline = pipeline.flatten({ background });
  }

  return pipeline
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

function buildOgCardSvg() {
  return Buffer.from(
    `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="72" y1="44" x2="1118" y2="584" gradientUnits="userSpaceOnUse">
          <stop stop-color="#EDF5F3"/>
          <stop offset="0.56" stop-color="#F7FBFB"/>
          <stop offset="1" stop-color="#FFF0F4"/>
        </linearGradient>
        <radialGradient id="glowWarm" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(977 183) rotate(90) scale(230)">
          <stop stop-color="#FFECCB" stop-opacity="0.88"/>
          <stop offset="1" stop-color="#FFECCB" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="glowPink" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1090 93) rotate(90) scale(148)">
          <stop stop-color="#F9C7D6" stop-opacity="0.44"/>
          <stop offset="1" stop-color="#F9C7D6" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="glowMint" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(716 544) rotate(90) scale(210)">
          <stop stop-color="#D6F4F0" stop-opacity="0.7"/>
          <stop offset="1" stop-color="#D6F4F0" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" rx="34" fill="url(#bg)"/>
      <circle cx="977" cy="183" r="230" fill="url(#glowWarm)"/>
      <circle cx="1090" cy="93" r="148" fill="url(#glowPink)"/>
      <circle cx="716" cy="544" r="210" fill="url(#glowMint)"/>
      <rect x="48" y="50" width="1104" height="534" rx="38" fill="rgba(255,255,255,0.66)" stroke="rgba(255,255,255,0.74)"/>
      <text x="84" y="132" fill="#47616B" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="5">ВЫЕЗДНОЙ КЕЙТЕРИНГ В МОСКВЕ</text>
      <text x="84" y="250" fill="#21262B" font-family="Arial, Helvetica, sans-serif" font-size="88" font-weight="900">Праздник</text>
      <text x="84" y="358" fill="#21262B" font-family="Arial, Helvetica, sans-serif" font-size="88" font-weight="900">каждый день</text>
      <text x="84" y="432" fill="#465158" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700">Сладкие станции, фудтраки</text>
      <text x="84" y="476" fill="#465158" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700">и праздничные форматы под ключ</text>
      <rect x="82" y="514" width="124" height="42" rx="21" fill="#F3D2E0"/>
      <rect x="226" y="514" width="154" height="42" rx="21" fill="#D7EBEA"/>
      <rect x="400" y="514" width="138" height="42" rx="21" fill="#FCEBB8"/>
      <text x="144" y="541" text-anchor="middle" fill="#435059" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700">вата</text>
      <text x="303" y="541" text-anchor="middle" fill="#435059" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700">попкорн</text>
      <text x="469" y="541" text-anchor="middle" fill="#435059" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700">фудтраки</text>
    </svg>`,
  );
}

async function generateOgImage(brandLogoBuffer) {
  const ogPath = path.join(publicDir, 'og-image.png');
  const ogWebpPath = path.join(publicDir, 'og-image.webp');
  const logo = await sharp(brandLogoBuffer)
    .resize(330, 330, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const png = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: buildOgCardSvg() },
      { input: logo, left: 770, top: 116 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(ogPath, png);
  await sharp(png).webp({ quality: 86, effort: 6 }).toFile(ogWebpPath);
}

async function main() {
  await mkdir(publicDir, { recursive: true });

  const maskedLogo = await loadMaskedLogo();
  const badgeLogo = await loadTrimmedAlphaImage(badgeSourcePath);
  const faviconBackground = { r: 255, g: 253, b: 248, alpha: 1 };
  const brandLogo = await makeLogoBuffer(maskedLogo, 1024, 0.2);
  const brandLogoUi = await makeLogoBuffer(maskedLogo, 384, 0.2);
  const ogLogo = await makeLogoBuffer(maskedLogo, 512, 0.08);
  const favicon = await makeLogoBuffer(badgeLogo, 256, 0.02, faviconBackground, true);
  const appleIcon = await makeLogoBuffer(badgeLogo, 180, 0.05, faviconBackground, true);
  const icon192 = await makeLogoBuffer(badgeLogo, 192, 0.05, faviconBackground, true);
  const icon512 = await makeLogoBuffer(badgeLogo, 512, 0.05, faviconBackground, true);
  const favicon16 = await makeLogoBuffer(badgeLogo, 16, 0.01, faviconBackground, true);
  const favicon32 = await makeLogoBuffer(badgeLogo, 32, 0.01, faviconBackground, true);
  const favicon48 = await makeLogoBuffer(badgeLogo, 48, 0.01, faviconBackground, true);

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

  const webManifest = `${JSON.stringify(
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
  )}\n`;

  await writeFile(path.join(publicDir, 'manifest.json'), webManifest);
  await writeFile(path.join(publicDir, 'site.webmanifest'), webManifest);

  await generateOgImage(ogLogo);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
