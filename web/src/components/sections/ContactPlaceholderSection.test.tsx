import { render, screen, within } from '@testing-library/react';
import { contactPlaceholderContent } from '../../data/siteContent';
import { ContactPlaceholderSection } from './ContactPlaceholderSection';

test('renders contact placeholder section with setup note', () => {
  render(<ContactPlaceholderSection />);

  const section = screen.getByTestId('section-contact');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Контакты' })).toBeInTheDocument();
  expect(sectionQueries.getByText(contactPlaceholderContent.note)).toBeInTheDocument();
});
