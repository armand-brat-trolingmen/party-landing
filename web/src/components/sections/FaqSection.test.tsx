import { render, screen, within } from '@testing-library/react';
import { faqPlaceholderContent } from '../../data/siteContent';
import { FaqSection } from './FaqSection';

test('renders faq section as a blank-page placeholder block', () => {
  render(<FaqSection />);

  const section = screen.getByTestId('section-faq');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Частые вопросы' })).toBeInTheDocument();

  expect(sectionQueries.getByText(faqPlaceholderContent.note)).toBeInTheDocument();
});
