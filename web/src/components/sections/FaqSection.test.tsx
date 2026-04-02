import { render, screen, within } from '@testing-library/react';
import { FaqSection } from './FaqSection';

test('renders faq as a cinematic accordion with the first item open by default', () => {
  render(<FaqSection />);

  const section = screen.getByTestId('section-faq');
  const sectionQueries = within(section);
  const accordion = sectionQueries.getByTestId('faq-accordion');
  const buttons = sectionQueries.getAllByRole('button');

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Частые вопросы' })).toBeInTheDocument();
  expect(sectionQueries.queryByTestId('faq-pattern')).not.toBeInTheDocument();
  expect(accordion).toHaveAttribute('data-motion-faq', 'cinematic');
  expect(buttons).toHaveLength(6);
  expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');

  const items = accordion.querySelectorAll('[data-motion-item="glow"]');
  expect(items).toHaveLength(6);
  expect(items[0]).toHaveAttribute('data-open', 'true');
});
