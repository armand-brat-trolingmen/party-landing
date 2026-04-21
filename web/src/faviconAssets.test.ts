import { resolve } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

async function getCornerAlpha(fileName: string) {
  const filePath = resolve(__dirname, '..', 'public', fileName);
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const topLeftAlpha = data[3];
  const topRightAlpha = data[((width - 1) * channels) + 3];
  const bottomLeftAlpha = data[(((height - 1) * width) * channels) + 3];
  const bottomRightAlpha = data[(((height * width) - 1) * channels) + 3];

  return [topLeftAlpha, topRightAlpha, bottomLeftAlpha, bottomRightAlpha];
}

describe('favicon assets', () => {
  it('render favicon png assets on an opaque background for search and dark UIs', async () => {
    await expect(getCornerAlpha('favicon.png')).resolves.toEqual([255, 255, 255, 255]);
    await expect(getCornerAlpha('favicon-32.png')).resolves.toEqual([255, 255, 255, 255]);
  });
});
