import { render, screen, within } from '@testing-library/react';
import { footerContent } from '../../data/footerContent';
import { contactActionsGuided } from '../../data/siteContent';
import { ContactPlaceholderSection } from './ContactPlaceholderSection';

test('renders contacts as a split canvas with direct details and a future visual slot', () => {
  render(<ContactPlaceholderSection />);

  const section = screen.getByTestId('section-contact');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Контакты' })).toBeInTheDocument();
  expect(section).not.toHaveAttribute('data-section-tone');
  expect(sectionQueries.getByTestId('contact-layout')).toHaveAttribute('data-contact-layout', 'split-canvas');
  expect(sectionQueries.queryByText(footerContent.legalAddress)).not.toBeInTheDocument();
  expect(sectionQueries.getByRole('link', { name: footerContent.phoneLabel })).toHaveAttribute('href', footerContent.phoneHref);
  expect(sectionQueries.getByRole('link', { name: footerContent.emailLabel })).toHaveAttribute('href', footerContent.emailHref);
  expect(sectionQueries.getByTestId('contact-icon-phone')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('contact-icon-email')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('contact-visual-slot')).toHaveAttribute('data-contact-visual', 'placeholder');

  for (const action of contactActionsGuided) {
    const link = sectionQueries.getByRole('link', { name: action.label });
    expect(link).toHaveAttribute('href', action.href);
  }

  expect(sectionQueries.getByTestId('contact-icon-telegram')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('contact-icon-whatsapp')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('contact-icon-avito')).toBeInTheDocument();
});
