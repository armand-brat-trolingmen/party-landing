import { getMediaFragmentShader } from './CircularGallery';

test('uses a contain shader branch that preserves the full image inside the plane', () => {
  const shader = getMediaFragmentShader('contain');

  expect(shader).toContain('containUv');
  expect(shader).toContain('discard;');
  expect(shader).not.toContain('vec2 uv = coverUv');
});

test('uses the cover shader branch for default cropped gallery rendering', () => {
  const shader = getMediaFragmentShader('cover');

  expect(shader).toContain('coverUv');
  expect(shader).toContain('vec2 uv = coverUv');
  expect(shader).not.toContain('containUv');
});
