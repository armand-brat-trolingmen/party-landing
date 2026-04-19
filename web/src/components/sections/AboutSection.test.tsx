import { render, screen, within } from '@testing-library/react';
import { AboutSection } from './AboutSection';

test('renders about as a compact premium manifest with a horizontal proof strip', () => {
  render(<AboutSection />);

  const section = screen.getByTestId('section-about');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'О нас' })).toBeInTheDocument();
  expect(sectionQueries.queryByText(/Собираем праздничные форматы/)).not.toBeInTheDocument();
  expect(section).not.toHaveAttribute('data-section-tone');
  expect(sectionQueries.getByTestId('about-layout')).toHaveAttribute('data-about-layout', 'manifest-band');
  const manifest = sectionQueries.getByTestId('about-manifest');
  expect(within(manifest).getAllByText(/./)).toHaveLength(4);
  expect(
    sectionQueries.getByText(
      'Компания «Праздник Каждый День» — это команда, которая превращает события в масштабные впечатления.',
    ),
  ).toBeInTheDocument();
  expect(sectionQueries.getByText('С нами ваш проект — это не просто событие, а эффект, который запоминается.')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('about-proof-strip')).toBeInTheDocument();
  expect(sectionQueries.getAllByTestId('about-fact')).toHaveLength(3);
  expect(sectionQueries.getByText('7+')).toBeInTheDocument();
  expect(sectionQueries.getByText('1500+')).toBeInTheDocument();
  expect(sectionQueries.getByText('10000+')).toBeInTheDocument();
});
