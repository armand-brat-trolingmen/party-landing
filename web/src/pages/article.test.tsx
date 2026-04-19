import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import ArticlePage from './article';

function renderArticlePage(path = '/articles/arenda-fudtraka-na-meropriyatie') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/articles/:slug" element={<ArticlePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

test('renders article detail page with content, related blocks and structured data', () => {
  renderArticlePage();

  expect(screen.getByRole('heading', { level: 1, name: 'Аренда фудтрака на мероприятие' })).toBeInTheDocument();
  expect(screen.queryByText('Полезный материал')).not.toBeInTheDocument();
  expect(screen.getByTestId('article-hero-image')).toHaveAttribute('src', '/images/food-trucks/food-truck-1.jpg');
  expect(screen.getByTestId('article-related-services')).toBeInTheDocument();
  expect(screen.getByTestId('article-faq')).toBeInTheDocument();
  expect(screen.getByTestId('article-cta')).toBeInTheDocument();
  expect(screen.getByTestId('article-related-articles')).toBeInTheDocument();

  const structuredData = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map((node) => node.textContent ?? '')
    .join(' ');

  expect(structuredData).toContain('"@type":"Article"');
  expect(structuredData).toContain('"@type":"BreadcrumbList"');
  expect(structuredData).toContain('"@type":"FAQPage"');
});

test('renders not found page for unknown article slug', () => {
  renderArticlePage('/articles/no-such-article');

  expect(screen.getByRole('heading', { level: 1, name: /Страница не найдена/i })).toBeInTheDocument();
});

test('article detail links related services without broken slugs', () => {
  renderArticlePage();

  const relatedServices = screen.getByTestId('article-related-services');

  expect(within(relatedServices).getByRole('link', { name: /Хот-дог \(Французский\)/i })).toHaveAttribute(
    'href',
    '/services/french-hot-dog/',
  );
  expect(within(relatedServices).getByRole('link', { name: /Крафтовый лимонад/i })).toHaveAttribute(
    'href',
    '/services/craft-lemonade/',
  );
});
