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
  expect(screen.queryByTestId('section-gallery')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Галерея' })).not.toBeInTheDocument();
  expect(screen.getByTestId('section-reviews')).toBeInTheDocument();
  expect(screen.getByTestId('section-faq')).toBeInTheDocument();
  expect(screen.getByLabelText('Частые вопросы')).toBeInTheDocument();
  expect(screen.getByTestId('section-contact')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Услуги', level: 2 })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'О нас', level: 2 })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Частые вопросы', level: 2 })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Контакты', level: 2 })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Отзывы', level: 2 })).toBeInTheDocument();

  const nav = within(pageBanner).getByRole('navigation', { name: 'Основная навигация' });
  const navLabels = within(nav)
    .getAllByRole('link')
    .map((link) => link.textContent?.trim());

  expect(navLabels).toEqual(['О нас', 'Услуги', 'Отзывы', 'Частые вопросы', 'Контакты']);

  const main = screen.getByRole('main');
  const sectionOrder = Array.from(main.querySelectorAll<HTMLElement>('[data-testid^="section-"]')).map((section) =>
    section.dataset.testid,
  );

  expect(sectionOrder).toEqual([
    'section-hero',
    'section-about',
    'section-services',
    'section-reviews',
    'section-faq',
    'section-contact',
  ]);
});

test('renders filled about section, real-photo reviews, and blank-page faq/contact placeholders', () => {
  render(<App />);

  const aboutSection = screen.getByTestId('section-about');
  const reviewsSection = screen.getByTestId('section-reviews');
  const faqSection = screen.getByTestId('section-faq');
  const contactSection = screen.getByTestId('section-contact');

  expect(within(aboutSection).getByRole('heading', { level: 2, name: 'О нас' })).toBeInTheDocument();
  expect(within(aboutSection).getByText('Собираем праздник как редакционную историю бренда.')).toBeInTheDocument();
  expect(within(aboutSection).getByText('Продумываем свет, фактуры и сервировку до мелочей.')).toBeInTheDocument();
  expect(within(aboutSection).getByText('Работаем бережно к площадке и вашему таймингу.')).toBeInTheDocument();
  expect(
    within(aboutSection).getByRole('img', { name: 'Иллюстрация редакционной истории бренда Party' }),
  ).toBeInTheDocument();
  expect(
    within(aboutSection).getByRole('img', { name: 'Иллюстрация постановки света и сервировки для события Party' }),
  ).toBeInTheDocument();
  expect(
    within(aboutSection).getByRole('img', { name: 'Иллюстрация точного тайминга и бережной работы на площадке Party' }),
  ).toBeInTheDocument();

  const reviews = within(reviewsSection);

  expect(reviews.getByRole('heading', { level: 2, name: 'Отзывы' })).toBeInTheDocument();
  expect(reviews.getAllByRole('img')).toHaveLength(4);
  expect(reviews.getByText('Аниматоры')).toBeInTheDocument();
  expect(reviews.getByText('Фудтрак')).toBeInTheDocument();
  expect(reviews.getByText('Сладкая вата')).toBeInTheDocument();
  expect(reviews.getByText('Шоколадный фонтан')).toBeInTheDocument();

  const faq = within(faqSection);
  const contact = within(contactSection);

  expect(faq.getByTestId('faq-pattern')).toBeInTheDocument();
  expect(contact.getByTestId('contact-pattern')).toBeInTheDocument();
});
