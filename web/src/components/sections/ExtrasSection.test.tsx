import { render, screen, within } from '@testing-library/react';
import { ExtrasSection } from './ExtrasSection';

test('renders extras inside the wide canvas without a framed outer surface', () => {
  render(<ExtrasSection />);

  const section = screen.getByTestId('section-extras');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Доп. услуги' })).toBeInTheDocument();
  expect(section).toHaveAttribute('data-section-tone', 'sky');
  expect(section.querySelector('[data-section-surface]')).toBeNull();
  expect(sectionQueries.getByTestId('extras-track')).toBeInTheDocument();
});
