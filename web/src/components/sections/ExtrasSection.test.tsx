import { render, screen, within } from '@testing-library/react';
import { ExtrasSection } from './ExtrasSection';

test('renders extras inside the frameless canvas shell', () => {
  render(<ExtrasSection />);

  const section = screen.getByTestId('section-extras');
  const sectionQueries = within(section);
  const surface = section.querySelector('[data-section-surface="canvas"][data-section-tone="sky"]');

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Доп. услуги' })).toBeInTheDocument();
  expect(surface).not.toBeNull();
  expect(sectionQueries.getByTestId('extras-track')).toBeInTheDocument();
});
