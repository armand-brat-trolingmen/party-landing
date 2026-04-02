import { render, screen, within } from '@testing-library/react';
import App from './App';

test('renders the one-page anchor shell', () => {
  render(<App />);

  const [pageBanner] = screen.getAllByRole('banner');
  const main = screen.getByRole('main');
  const nav = within(pageBanner).getByRole('navigation');

  expect(pageBanner).toBeInTheDocument();
  expect(within(pageBanner).getByRole('link', { name: 'Party' })).toBeInTheDocument();
  expect(main).toBeInTheDocument();
  expect(main).toHaveAttribute('data-motion-path', 'glow-trail');
  expect(within(nav).getAllByRole('link')).toHaveLength(5);

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

test('wires layered hero motion, ambient section glow, cinematic reviews, and header motion hooks', () => {
  render(<App />);

  const heroScene = screen.getByTestId('hero-scene');
  const heroFrame = screen.getByTestId('hero-scene-frame');
  const reviewsSection = screen.getByTestId('section-reviews');
  const header = screen.getByTestId('site-header');

  expect(heroScene).toHaveAttribute('data-motion-scene', 'layered');
  expect(heroFrame).toHaveAttribute('data-motion-frame', 'parallax');
  expect(screen.getByTestId('hero-scene-card-cotton-candy')).toHaveAttribute('data-motion-depth', 'back');
  expect(screen.getByTestId('hero-scene-card-food-truck')).toHaveAttribute('data-motion-depth', 'front');
  expect(screen.getByTestId('hero-scene-card-chocolate-fountain')).toHaveAttribute('data-motion-depth', 'mid');

  expect(document.querySelectorAll('.site-panel-glow')).toHaveLength(5);
  expect(header).toHaveAttribute('data-header-state', 'rest');
  expect(screen.getByTestId('nav-active-indicator')).toBeInTheDocument();

  const reviewCards = within(reviewsSection).getAllByTestId('review-story-card');
  for (const card of reviewCards) {
    expect(card).toHaveAttribute('data-motion-card', 'cinematic');
    expect(card).toHaveAttribute('data-live-shot', 'true');
  }
});

test('renders filled sections with service, faq, and contact motion hooks', () => {
  render(<App />);

  const servicesSection = screen.getByTestId('section-services');
  const faqSection = screen.getByTestId('section-faq');
  const contactSection = screen.getByTestId('section-contact');

  expect(within(servicesSection).getByRole('heading', { level: 2 })).toBeInTheDocument();
  expect(within(servicesSection).getAllByRole('img')).toHaveLength(4);
  expect(servicesSection.querySelectorAll('[data-motion-service="micro-scene"]')).toHaveLength(4);

  const faq = within(faqSection);
  expect(faq.getByTestId('faq-accordion')).toHaveAttribute('data-motion-faq', 'cinematic');
  expect(faq.queryByTestId('faq-pattern')).not.toBeInTheDocument();
  expect(faq.getAllByRole('button')).toHaveLength(6);

  expect(within(contactSection).getByRole('heading', { level: 2 })).toBeInTheDocument();
  expect(within(contactSection).getByTestId('contact-note')).toBeInTheDocument();
});
