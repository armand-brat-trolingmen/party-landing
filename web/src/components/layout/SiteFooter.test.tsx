import { render, screen, within } from '@testing-library/react';
import { siteConfig } from '../../content';
import { SiteFooter } from './SiteFooter';

test('renders compact footer with contact data, legal details, and legal links', () => {
  render(<SiteFooter />);

  const footer = screen.getByRole('contentinfo');
  expect(within(footer).getByTestId('footer-brand-link')).toBeInTheDocument();
  expect(within(footer).queryByText(siteConfig.brand.name)).not.toBeInTheDocument();

  for (const socialLink of siteConfig.contacts.socialLinks) {
    expect(within(footer).getByRole('link', { name: socialLink.label })).toHaveAttribute('href', socialLink.href);
  }

  expect(within(footer).getByRole('link', { name: siteConfig.contacts.phone.display })).toHaveAttribute(
    'href',
    siteConfig.contacts.phone.href,
  );
  expect(within(footer).getByRole('link', { name: siteConfig.contacts.email.display })).toHaveAttribute(
    'href',
    siteConfig.contacts.email.href,
  );

  expect(within(footer).getByText(siteConfig.legal.business.name)).toBeInTheDocument();
  expect(within(footer).getByText(siteConfig.legal.business.inn)).toBeInTheDocument();
  expect(within(footer).getByText(siteConfig.legal.business.ogrnip)).toBeInTheDocument();
  expect(within(footer).getByText(siteConfig.legal.business.address)).toBeInTheDocument();

  for (const legalLink of siteConfig.legal.links) {
    expect(within(footer).getByRole('link', { name: legalLink.label })).toHaveAttribute('href', legalLink.href);
  }
});
