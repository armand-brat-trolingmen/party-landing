import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router';
import { siteConfig } from '../../content';
import CookiesPage from '../../pages/cookies';
import OfferPage from '../../pages/offer';
import PrivacyPage from '../../pages/privacy';
import styles from './LegalPageLayout.module.css';

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
  expect(screen.getByText('г. Москва 2026 г.')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: '1. ОПРЕДЕЛЕНИЕ ТЕРМИНОВ' })).toBeInTheDocument();
  expect(screen.getByText(/«Персональные данные» - любая информация/)).toBeInTheDocument();
  expect(screen.getByText(/Контактный телефон Пользователя/)).toBeInTheDocument();
  expect(screen.getByTestId('legal-document-sheet').querySelector(`.${styles.sheetHeader}`)).toBeNull();
  expect(screen.getByRole('link', { name: siteConfig.contacts.phone.display })).toHaveAttribute(
    'href',
    siteConfig.contacts.phone.href,
  );
  expect(screen.getByRole('link', { name: siteConfig.contacts.email.display })).toHaveAttribute(
    'href',
    siteConfig.contacts.email.href,
  );
  expect(screen.queryByTestId('legal-document-lines')).not.toBeInTheDocument();
  expect(screen.queryByText(/Этот документ описывает/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Актуально на/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/\+7\s*\(999\)\s*999-99-99/)).not.toBeInTheDocument();
  expect(screen.queryByText(/contact@party-everyday\.ru/i)).not.toBeInTheDocument();
});

test('keeps distinct legal page titles while rendering the real offer and cookie documents', () => {
  const { rerender } = renderLegalPage(<OfferPage />, '/offer');

  expect(screen.getByRole('heading', { level: 1, name: siteConfig.legal.documents.offer.title })).toBeInTheDocument();
  expect(screen.getByTestId('legal-document-sheet')).toBeInTheDocument();
  expect(screen.getByText(/«14» апреля 2026 года/)).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: '1. ОБЩИЕ ПОЛОЖЕНИЯ' })).toBeInTheDocument();
  expect(screen.getByText(/Полным и безоговорочным акцептом настоящей оферты/)).toBeInTheDocument();

  rerender(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/cookies']}>
        <CookiesPage />
      </MemoryRouter>
    </HelmetProvider>,
  );

  expect(screen.getByRole('heading', { level: 1, name: siteConfig.legal.documents.cookies.title })).toBeInTheDocument();
  expect(screen.getByTestId('legal-document-sheet')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: '1. Общие положения' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: '2. Что такое Cookies?' })).toBeInTheDocument();
  expect(screen.getByText(/Яндекс Метрика/)).toBeInTheDocument();
  expect(screen.getByText(/Google Tag Manager/)).toBeInTheDocument();
});
