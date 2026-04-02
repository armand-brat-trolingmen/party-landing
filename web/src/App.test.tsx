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

  const reviews = within(reviewsSection);

  expect(reviews.getByRole('heading', { level: 2, name: 'Отзывы' })).toBeInTheDocument();
  expect(reviews.getAllByRole('img')).not.toHaveLength(0);
  expect(reviews.getByRole('img', { name: /гости на празднике party/i })).toHaveAttribute(
    'src',
    expect.stringContaining('/images/reviews/review-party-1.png'),
  );

  const faq = within(faqSection);
  const contact = within(contactSection);

  expect(faq.getByTestId('faq-pattern')).toBeInTheDocument();
  expect(contact.getByTestId('contact-pattern')).toBeInTheDocument();
});
