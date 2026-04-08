import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router';
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

test('renders privacy page as a blank document shell without old legal copy', () => {
  renderLegalPage(<PrivacyPage />, '/privacy');

  expect(screen.getByRole('heading', { level: 1, name: 'Политика конфиденциальности' })).toBeInTheDocument();
  expect(screen.getByTestId('legal-document-sheet')).toBeInTheDocument();
  expect(screen.getByTestId('legal-document-lines')).toBeInTheDocument();
  expect(screen.queryByText(/Этот документ описывает/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Актуально на/i)).not.toBeInTheDocument();
});

test('keeps distinct legal page titles while reusing the same blank document layout', () => {
  const { rerender } = renderLegalPage(<TermsPage />, '/terms');

  expect(screen.getByRole('heading', { level: 1, name: 'Пользовательское соглашение' })).toBeInTheDocument();
  expect(screen.getByTestId('legal-document-sheet')).toBeInTheDocument();

  rerender(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/consent']}>
        <ConsentPage />
      </MemoryRouter>
    </HelmetProvider>,
  );

  expect(
    screen.getByRole('heading', { level: 1, name: 'Согласие на обработку персональных данных' }),
  ).toBeInTheDocument();
  expect(screen.getByTestId('legal-document-sheet')).toBeInTheDocument();
});
