import { render, screen, within } from '@testing-library/react';
import App from './App';

test('renders the one-page anchor shell', () => {
  render(<App />);

  const [pageBanner] = screen.getAllByRole('banner');

  expect(pageBanner).toBeInTheDocument();
  expect(within(pageBanner).getByRole('link', { name: 'Party' })).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: 'Основная навигация' })).toBeInTheDocument();
  expect(screen.getByTestId('section-hero')).toBeInTheDocument();
  expect(screen.getByTestId('section-services')).toBeInTheDocument();
  expect(screen.getByTestId('section-about')).toBeInTheDocument();
  expect(screen.getByTestId('section-gallery')).toBeInTheDocument();
  expect(screen.getByTestId('section-reviews')).toBeInTheDocument();
  expect(screen.getByTestId('section-faq')).toBeInTheDocument();
  expect(screen.getByLabelText('Частые вопросы')).toBeInTheDocument();
  expect(screen.getByTestId('section-contact')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Услуги', level: 2 })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'О нас', level: 2 })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Частые вопросы', level: 2 })).toBeInTheDocument();
});

test('renders filled about and gallery sections with editorial object scenes', () => {
  render(<App />);

  const aboutSection = screen.getByTestId('section-about');
  const gallerySection = screen.getByTestId('section-gallery');

  expect(within(aboutSection).getByRole('heading', { level: 2, name: 'О нас' })).toBeInTheDocument();
  expect(within(aboutSection).getByText('Собираем праздник как редакционную историю бренда.')).toBeInTheDocument();
  expect(within(aboutSection).getByText('Продумываем свет, фактуры и сервировку до мелочей.')).toBeInTheDocument();
  expect(within(aboutSection).getByText('Работаем бережно к площадке и вашему таймингу.')).toBeInTheDocument();

  const gallery = within(gallerySection);

  expect(gallery.getByRole('heading', { level: 2, name: 'Галерея' })).toBeInTheDocument();
  expect(gallery.getByRole('img', { name: 'Фудтрак с вечерней неоновой вывеской' })).toBeInTheDocument();
  expect(gallery.getByRole('img', { name: 'Шоколадный фонтан с ягодным декором' })).toBeInTheDocument();
  expect(gallery.getByRole('img', { name: 'Тележка со сладкой ватой в пастельных тонах' })).toBeInTheDocument();
});
