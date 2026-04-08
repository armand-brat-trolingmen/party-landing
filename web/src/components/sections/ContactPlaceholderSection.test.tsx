import { render, screen, within } from '@testing-library/react';
import { contactActionsGuided, contactGuidedCopy, contactPromptItems } from '../../data/siteContent';
import { ContactPlaceholderSection } from './ContactPlaceholderSection';

test('renders contacts as a guided practical block with messenger icons and first-message prompts', () => {
  render(<ContactPlaceholderSection />);

  const section = screen.getByTestId('section-contact');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Контакты' })).toBeInTheDocument();
  expect(sectionQueries.getByTestId('contact-layout')).toHaveAttribute('data-contact-layout', 'guided');
  expect(sectionQueries.getByTestId('contact-guide')).toHaveAttribute('data-contact-guide', 'first-message');
  expect(sectionQueries.getByText(contactGuidedCopy.guideTitle)).toBeInTheDocument();

  for (const prompt of contactPromptItems) {
    expect(sectionQueries.getByText(prompt)).toBeInTheDocument();
  }

  expect(sectionQueries.getByText(contactGuidedCopy.exampleMessage)).toBeInTheDocument();
  expect(sectionQueries.queryByText('Москва и МО')).not.toBeInTheDocument();

  for (const action of contactActionsGuided) {
    const link = sectionQueries.getByRole('link', { name: action.label });
    expect(link).toHaveAttribute('href', action.href);
  }

  expect(sectionQueries.getByTestId('contact-icon-telegram')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('contact-icon-whatsapp')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('contact-icon-avito')).toBeInTheDocument();
});
