import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router';
import ArticlesPage from './articles';

function renderArticlesPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/articles']}>
        <Routes>
          <Route path="/articles" element={<ArticlesPage />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

test('renders articles index with all initial SEO articles', () => {
  renderArticlesPage();

  expect(screen.getByRole('heading', { level: 1, name: 'Статьи' })).toBeInTheDocument();
  expect(screen.queryByText('Статьи', { selector: 'p' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Как выбрать фуд-станцию/i })).toHaveAttribute(
    'href',
    '/articles/kak-vybrat-food-station/',
  );
  expect(screen.getByRole('link', { name: /Сладкие станции/i })).toHaveAttribute(
    'href',
    '/articles/sladkie-stancii-na-detskiy-prazdnik/',
  );
  expect(screen.getByRole('link', { name: /Аренда фудтрака/i })).toHaveAttribute(
    'href',
    '/articles/arenda-fudtraka-na-meropriyatie/',
  );
});

test('articles index writes canonical SEO tags', () => {
  renderArticlesPage();

  expect(document.title).toContain('Статьи');
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://party-everyday.ru/articles/');
});
