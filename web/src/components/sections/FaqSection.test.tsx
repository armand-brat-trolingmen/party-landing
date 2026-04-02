import { render, screen, within } from '@testing-library/react';
import { FaqSection } from './FaqSection';

test('renders faq section with a clean pattern panel and no placeholder copy', () => {
  render(<FaqSection />);

  const section = screen.getByTestId('section-faq');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Частые вопросы' })).toBeInTheDocument();
  expect(sectionQueries.getByTestId('faq-pattern')).toBeInTheDocument();
  expect(sectionQueries.queryByText(/бланк|черновом режиме|скоро добавим/i)).not.toBeInTheDocument();
});
