import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { homepage, heroPosterSlides } from './homepage';
import { serviceGalleries } from './serviceGalleries.generated';

function toPublicPath(assetPath: string) {
  return resolve(process.cwd(), 'public', assetPath.replace(/^\//, ''));
}

function expandSrcSet(srcSet: string) {
  return srcSet
    .split(',')
    .map((entry) => entry.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function collectHomepageAssets() {
  const directAssets = [
    ...heroPosterSlides.flatMap((slide) => [slide.image, slide.fallbackImage]),
    ...heroPosterSlides.flatMap((slide) => expandSrcSet(slide.imageWebpSrcSet)),
    ...homepage.foodTruckRental.items.flatMap((item) => [item.image, item.imageWebpSrcSet]),
    ...homepage.foodTrucks.items.flatMap((item) => [item.image, item.imageWebpSrcSet]),
  ];

  return [...new Set(directAssets)];
}

test('homepage hero and food truck image assets resolve to existing public files', () => {
  const missingAssets = collectHomepageAssets().filter((assetPath) => !existsSync(toPublicPath(assetPath)));

  expect(missingAssets).toEqual([]);
});

test('generated service gallery assets resolve to existing public files', () => {
  const missingAssets = Object.values(serviceGalleries)
    .flatMap((gallery) => gallery ?? [])
    .flatMap((image) => [image.src, image.originalSrc, ...expandSrcSet(image.webpSrcSet)])
    .filter((assetPath) => !existsSync(toPublicPath(assetPath)));

  expect(missingAssets).toEqual([]);
});
