import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ArticlesTeaserSection } from './ArticlesTeaserSection';

test('renders compact homepage articles teaser with a single direct link', () => {
  render(
    <MemoryRouter>
      <ArticlesTeaserSection />
    </MemoryRouter>,
  );

  expect(screen.getByTestId('section-articles-teaser')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: /Не уверены, какой формат выбрать/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Читать статьи/i })).toHaveAttribute('href', '/articles/');
});
