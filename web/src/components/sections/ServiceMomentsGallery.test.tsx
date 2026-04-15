import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { ServiceMomentsGallery } from './ServiceMomentsGallery';

const galleryImages = [
  {
    id: 'image-01',
    src: '/images/test/service-1.jpg',
    originalSrc: '/images/test/service-1-original.jpg',
    webpSrcSet: '/images/test/service-1-480.webp 480w, /images/test/service-1-960.webp 960w',
    sizes: '(max-width: 720px) 74vw, 22vw',
    width: 960,
    height: 960,
    originalWidth: 2048,
    originalHeight: 1365,
    alt: 'Тестовое фото услуги 1',
  },
  {
    id: 'image-02',
    src: '/images/test/service-2.jpg',
    originalSrc: '/images/test/service-2-original.jpg',
    webpSrcSet: '/images/test/service-2-480.webp 480w, /images/test/service-2-960.webp 960w',
    sizes: '(max-width: 720px) 74vw, 22vw',
    width: 960,
    height: 960,
    originalWidth: 1600,
    originalHeight: 1600,
    alt: 'Тестовое фото услуги 2',
  },
] as const;

test('opens a fullscreen service gallery preview from a slide button on any viewport', () => {
  const originalScrollTo = window.scrollTo;

  window.scrollTo = vi.fn();

  render(<ServiceMomentsGallery images={galleryImages} />);

  expect(screen.queryByRole('dialog', { name: 'Фотография услуги' })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Открыть фото 1 на весь экран' }));

  const dialog = screen.getByRole('dialog', { name: 'Фотография услуги' });
  const dialogQueries = within(dialog);
  const overlay = screen.getByTestId('offering-gallery-dialog-overlay');

  expect(dialog).toHaveAttribute('aria-modal', 'true');
  expect(dialog).toHaveAttribute('data-dialog-presentation', 'fullscreen');
  expect(overlay).toHaveAttribute('data-dialog-state', 'open');
  expect(dialogQueries.getByRole('img', { name: 'Тестовое фото услуги 1' })).toHaveAttribute(
    'src',
    '/images/test/service-1-original.jpg',
  );
  expect(dialogQueries.getAllByRole('button')).toHaveLength(1);

  fireEvent.keyDown(window, { key: 'Escape' });

  expect(screen.queryByRole('dialog', { name: 'Фотография услуги' })).not.toBeInTheDocument();
  window.scrollTo = originalScrollTo;
});
