import { heroPosterSlides } from './homepage';

test('keeps the fountain poster first and fills the hero carousel with the new gallery photos', () => {
  const slideIds = heroPosterSlides.map((slide) => slide.id);

  expect(heroPosterSlides[0]?.fallbackImage).toBe('/images/hero/hero-main.png');
  expect(slideIds).not.toContain('cotton-candy');
  expect(slideIds.filter((id) => id.startsWith('gallery-'))).toHaveLength(13);
});
