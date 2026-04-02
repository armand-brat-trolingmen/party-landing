import { render, screen, within } from '@testing-library/react';
import { ContactPlaceholderSection } from './ContactPlaceholderSection';

test('renders contact section with a clean pattern panel and no placeholder copy', () => {
  render(<ContactPlaceholderSection />);

  const section = screen.getByTestId('section-contact');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Контакты' })).toBeInTheDocument();
  expect(sectionQueries.getByTestId('contact-pattern')).toBeInTheDocument();
  expect(sectionQueries.queryByText(/директ|скоро здесь|появится полноценный/i)).not.toBeInTheDocument();
});
