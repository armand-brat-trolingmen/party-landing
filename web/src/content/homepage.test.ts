import { heroPosterSlides } from './homepage';

test('keeps the fountain poster first and fills the hero carousel with the new gallery photos', () => {
  const slideIds = heroPosterSlides.map((slide) => slide.id);
  const replacementSlide = heroPosterSlides.find((slide) => slide.id === 'gallery-10');

  expect(heroPosterSlides[0]?.fallbackImage).toBe('/images/hero/hero-main.png');
  expect(slideIds).not.toContain('cotton-candy');
  expect(slideIds.filter((id) => id.startsWith('gallery-'))).toHaveLength(13);
  expect(replacementSlide).toMatchObject({
    image: '/images/hero/hero-gallery-10.jpg',
    width: 2560,
    height: 1920,
  });
});
