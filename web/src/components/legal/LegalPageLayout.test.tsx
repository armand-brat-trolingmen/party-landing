import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router';
import { siteConfig } from '../../content';
import ConsentPage from '../../pages/consent';
import PrivacyPage from '../../pages/privacy';
import TermsPage from '../../pages/terms';

function renderLegalPage(page: React.ReactNode, entry = '/') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[entry]}>{page}</MemoryRouter>
    </HelmetProvider>,
  );
}

test('renders privacy page with the shared legal shell and live footer contacts', () => {
  renderLegalPage(<PrivacyPage />, '/privacy');

  expect(screen.getByRole('heading', { level: 1, name: siteConfig.legal.documents.privacy.title })).toBeInTheDocument();
  expect(screen.getByTestId('legal-document-sheet')).toBeInTheDocument();
  expect(screen.getByTestId('legal-document-lines')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: siteConfig.contacts.phone.display })).toHaveAttribute(
    'href',
    siteConfig.contacts.phone.href,
  );
  expect(screen.getByRole('link', { name: siteConfig.contacts.email.display })).toHaveAttribute(
    'href',
    siteConfig.contacts.email.href,
  );
  expect(screen.queryByText(/Этот документ описывает/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Актуально на/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/\+7\s*\(999\)\s*999-99-99/)).not.toBeInTheDocument();
  expect(screen.queryByText(/contact@party-everyday\.ru/i)).not.toBeInTheDocument();
});

test('keeps distinct legal page titles while reusing the same blank document layout', () => {
  const { rerender } = renderLegalPage(<TermsPage />, '/terms');

  expect(screen.getByRole('heading', { level: 1, name: siteConfig.legal.documents.terms.title })).toBeInTheDocument();
  expect(screen.getByTestId('legal-document-sheet')).toBeInTheDocument();

  rerender(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/consent']}>
        <ConsentPage />
      </MemoryRouter>
    </HelmetProvider>,
  );

  expect(screen.getByRole('heading', { level: 1, name: siteConfig.legal.documents.consent.title })).toBeInTheDocument();
  expect(screen.getByTestId('legal-document-sheet')).toBeInTheDocument();
});
