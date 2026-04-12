import { fireEvent, render, screen, within } from '@testing-library/react';
import { siteConfig } from '../../content';
import { ContactPlaceholderSection } from './ContactPlaceholderSection';

test('renders contacts as a split canvas with direct details and an Avito screenshot', () => {
  render(<ContactPlaceholderSection />);

  const section = screen.getByTestId('section-contact');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Контакты' })).toBeInTheDocument();
  expect(section).not.toHaveAttribute('data-section-tone');
  expect(sectionQueries.getByTestId('contact-layout')).toHaveAttribute('data-contact-layout', 'split-canvas');
  expect(sectionQueries.queryByText(siteConfig.legal.business.address)).not.toBeInTheDocument();
  expect(sectionQueries.getByRole('link', { name: siteConfig.contacts.phone.display })).toHaveAttribute(
    'href',
    siteConfig.contacts.phone.href,
  );
  expect(sectionQueries.getByRole('link', { name: siteConfig.contacts.email.display })).toHaveAttribute(
    'href',
    siteConfig.contacts.email.href,
  );
  expect(sectionQueries.getByTestId('contact-icon-phone')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('contact-icon-email')).toBeInTheDocument();

  const visualSlot = sectionQueries.getByTestId('contact-visual-slot');
  const avitoImage = sectionQueries.getByRole('img', { name: 'Профиль Праздник каждый день на Avito' });

  expect(visualSlot).toHaveAttribute('data-contact-visual', 'avito');
  expect(avitoImage).toHaveAttribute('src', '/images/contact/avito.jpg');

  for (const action of siteConfig.homepage.contact.actions) {
    const link = sectionQueries.getByRole('link', { name: action.label });
    expect(link).toHaveAttribute('href', action.href);
  }

  expect(sectionQueries.getByTestId('contact-icon-telegram')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('contact-icon-whatsapp')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('contact-icon-avito')).toBeInTheDocument();
});

test('opens the Avito screenshot in a true fullscreen dialog from the contact visual', () => {
  render(<ContactPlaceholderSection />);

  expect(screen.queryByRole('dialog', { name: 'Скриншот Avito' })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Открыть скриншот Avito на весь экран' }));

  const dialog = screen.getByRole('dialog', { name: 'Скриншот Avito' });
  const dialogQueries = within(dialog);
  const overlay = screen.getByTestId('contact-visual-dialog-overlay');

  expect(dialog).toHaveAttribute('aria-modal', 'true');
  expect(dialog).toHaveAttribute('aria-label', 'Скриншот Avito');
  expect(dialog).toHaveAttribute('data-dialog-presentation', 'fullscreen');
  expect(dialogQueries.queryByText('Скриншот Avito')).not.toBeInTheDocument();
  expect(overlay).toHaveAttribute('data-dialog-state', 'open');
  expect(overlay.parentElement).toBe(document.body);
  expect(dialogQueries.getByRole('img', { name: 'Скриншот профиля Праздник каждый день на Avito' })).toHaveAttribute(
    'src',
    '/images/contact/avito.jpg',
  );

  fireEvent.keyDown(window, { key: 'Escape' });

  expect(screen.queryByRole('dialog', { name: 'Скриншот Avito' })).not.toBeInTheDocument();
});
