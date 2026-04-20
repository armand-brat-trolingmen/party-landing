import { heroPosterSlides } from './homepage';

test('keeps the fountain poster first and fills the hero carousel with the new gallery photos', () => {
  const slideIds = heroPosterSlides.map((slide) => slide.id);
  const replacementSlide = heroPosterSlides.find((slide) => slide.id === 'gallery-10');
  const croppedSlide = heroPosterSlides.find((slide) => slide.id === 'gallery-13');
  const addedSlide = heroPosterSlides.find((slide) => slide.id === 'gallery-14');

  expect(heroPosterSlides[0]?.fallbackImage).toBe('/images/hero/hero-main.png');
  expect(slideIds).not.toContain('cotton-candy');
  expect(slideIds).not.toContain('gallery-11');
  expect(slideIds.filter((id) => id.startsWith('gallery-'))).toHaveLength(13);
  expect(replacementSlide).toMatchObject({
    image: '/images/hero/hero-gallery-10.jpg',
    width: 2560,
    height: 1920,
  });
  expect(croppedSlide).toMatchObject({
    image: '/images/hero/hero-gallery-13.jpg',
    width: 1607,
    height: 1700,
  });
  expect(addedSlide).toMatchObject({
    image: '/images/hero/hero-gallery-14.jpg',
    width: 1714,
    height: 2560,
  });
});
