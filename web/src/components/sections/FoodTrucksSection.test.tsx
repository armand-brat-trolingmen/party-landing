import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { FoodTrucksSection } from './FoodTrucksSection';

test('renders the catering food trucks section with gallery assets and story copy', () => {
  render(
    <MemoryRouter>
      <FoodTrucksSection />
    </MemoryRouter>,
  );

  const section = screen.getByTestId('section-food-trucks');
  const sectionQueries = within(section);
  const gallery = sectionQueries.getByTestId('food-trucks-gallery');

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Кейтеринг на фудтраках' })).toBeInTheDocument();
  expect(
    sectionQueries.getByText(
      'Стритфуд от профессионалов — это настоящее гастрономическое шоу, где каждая деталь превращает уличную еду в яркий и незабываемый праздник вкуса.',
    ),
  ).toBeInTheDocument();
  expect(sectionQueries.getByRole('heading', { level: 3, name: 'Почему клиенты доверяют нам?' })).toBeInTheDocument();
  expect(sectionQueries.queryByText('Посуточная аренда от 15.000 ₽ в сутки')).not.toBeInTheDocument();
  expect(sectionQueries.queryByText('Месячная аренда от 80.000 ₽ в месяц')).not.toBeInTheDocument();

  const images = sectionQueries.getAllByTestId('food-truck-gallery-image');
  expect(images).toHaveLength(10);
  expect(gallery).toHaveAttribute('data-gallery-mode', 'fallback');
  expect(sectionQueries.queryByTestId('food-truck-gallery-source-webp')).not.toBeInTheDocument();
  expect(images[0]).toHaveAttribute('src', '/images/food-trucks/food-truck-1.jpg');
  expect(images[0]).toHaveAttribute('loading', 'eager');
  expect(images[1]).toHaveAttribute('loading', 'eager');
  expect(images[2]).toHaveAttribute('loading', 'eager');
  expect(images[3]).toHaveAttribute('loading', 'lazy');
  expect(images[0]).toHaveStyle({ objectFit: 'contain' });
  expect(images[1]).toHaveStyle({ objectFit: 'contain' });
  expect(images[4]).toHaveAttribute('alt', 'Фудтрак для кейтеринга на выездном мероприятии, фото 5');
  expect(images[9]).toHaveAttribute('src', '/images/food-trucks/food-truck-10.jpg');
  expect(images.every((image) => !image.getAttribute('alt')?.includes('?'))).toBe(true);
});

test('does not force-disable the interactive food truck gallery in source code', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/components/sections/FoodTrucksSection.tsx'), 'utf8');

  expect(source).not.toContain('interactiveMode="off"');
  expect(source).toContain('imageFit="contain"');
});
