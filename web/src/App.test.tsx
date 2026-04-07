import { render, screen, within } from '@testing-library/react';
import App from './App';

test('renders the one-page anchor shell with the revised section order and story motion path', () => {
  render(<App />);

  const [pageBanner] = screen.getAllByRole('banner');
  const main = screen.getByRole('main');
  const nav = within(pageBanner).getByRole('navigation');
  const footer = screen.getByRole('contentinfo');

  expect(pageBanner).toBeInTheDocument();
  expect(within(pageBanner).getByRole('link', { name: 'Party Everyday' })).toBeInTheDocument();
  expect(within(pageBanner).queryByText('Party Everyday')).not.toBeInTheDocument();
  expect(main).toBeInTheDocument();
  expect(footer).toBeInTheDocument();
  expect(within(footer).getByText('Party Everyday')).toBeInTheDocument();
  expect(within(footer).getByRole('link', { name: 'Политика конфиденциальности' })).toHaveAttribute(
    'href',
    '/privacy',
  );
  expect(main).toHaveAttribute('data-motion-path', 'story-trail');
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

test('wires layered hero motion, glass header behavior, and manual moment feed hooks', () => {
  render(<App />);

  const heroScene = screen.getByTestId('hero-scene');
  const heroFrame = screen.getByTestId('hero-scene-frame');
  const reviewsSection = screen.getByTestId('section-reviews');
  const header = screen.getByTestId('site-header');

  expect(heroScene).toHaveAttribute('data-motion-scene', 'layered');
  expect(heroFrame).toHaveAttribute('data-motion-frame', 'parallax');
  expect(screen.getByTestId('section-hero')).toHaveAttribute('data-hero-style', 'poster');
  expect(screen.getByTestId('section-hero')).toHaveTextContent('Party Everyday');
  expect(screen.getByTestId('hero-scene-card-cotton-candy')).toHaveAttribute('data-motion-depth', 'back');
  expect(screen.getByTestId('hero-scene-card-food-truck')).toHaveAttribute('data-motion-depth', 'front');
  expect(screen.getByTestId('hero-scene-card-chocolate-fountain')).toHaveAttribute('data-motion-depth', 'mid');

  expect(document.querySelectorAll('.site-panel-glow')).toHaveLength(5);
  expect(header).toHaveAttribute('data-header-state', 'rest');
  expect(header).toHaveAttribute('data-header-material', 'glass');
  expect(screen.getByTestId('nav-active-indicator')).toBeInTheDocument();

  expect(within(reviewsSection).getByTestId('moment-feed-slider')).toHaveAttribute('data-slider-mode', 'manual');
  expect(within(reviewsSection).getByTestId('moment-feed-slider')).toHaveAttribute('data-slider-layout', 'single-scene');
  expect(within(reviewsSection).getByTestId('moment-feed-slider')).toHaveAttribute(
    'data-slider-transition',
    'soft-swap',
  );
  expect(within(reviewsSection).getAllByTestId('moment-feed-slide')).toHaveLength(1);
});

test('renders redesigned about, faq, and practical contacts hooks', () => {
  render(<App />);

  const aboutSection = screen.getByTestId('section-about');
  const servicesSection = screen.getByTestId('section-services');
  const faqSection = screen.getByTestId('section-faq');
  const contactSection = screen.getByTestId('section-contact');

  expect(within(aboutSection).getByTestId('about-atmosphere-stage')).toHaveAttribute('data-about-layout', 'atelier');
  expect(within(aboutSection).getAllByTestId('about-accent')).toHaveLength(3);
  expect(within(servicesSection).getByRole('heading', { level: 2 })).toBeInTheDocument();
  expect(within(servicesSection).getAllByRole('img')).toHaveLength(3);
  expect(servicesSection.querySelectorAll('[data-motion-service="micro-scene"]')).toHaveLength(3);

  const faq = within(faqSection);
  expect(faq.getByTestId('faq-accordion')).toHaveAttribute('data-motion-faq', 'cinematic');
  expect(faq.queryByTestId('faq-pattern')).not.toBeInTheDocument();
  expect(faq.getAllByRole('button')).toHaveLength(6);

  expect(within(contactSection).getByRole('heading', { level: 2 })).toBeInTheDocument();
  expect(within(contactSection).getByTestId('contact-layout')).toHaveAttribute('data-contact-layout', 'guided');
  expect(within(contactSection).getByTestId('contact-guide')).toHaveAttribute('data-contact-guide', 'first-message');
});
