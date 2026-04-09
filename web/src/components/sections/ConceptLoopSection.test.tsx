import { render, screen, within } from '@testing-library/react';
import { conceptLoopItems, conceptLoopSeparator } from '../../data/siteContent';
import { ConceptLoopSection } from './ConceptLoopSection';

test('renders a decorative concept loop band with the stable shuffled phrases', () => {
  render(<ConceptLoopSection />);

  const section = screen.getByTestId('section-concept-loop');
  const sectionQueries = within(section);
  const primarySequence = within(sectionQueries.getByTestId('text-loop-sequence-primary'));

  expect(section).toHaveAttribute('data-band-tone', 'cta-purple');
  expect(sectionQueries.getByTestId('concept-loop-band')).toHaveAttribute('data-band-style', 'soft-marquee');
  expect(sectionQueries.getByTestId('concept-loop-band')).toHaveAttribute('data-band-width', 'full-bleed');
  expect(sectionQueries.getByTestId('concept-loop-band')).toHaveAttribute('data-band-scale', 'tall');
  expect(sectionQueries.getByTestId('concept-loop-band')).toHaveAttribute('data-content-span', 'wide');
  expect(sectionQueries.getByTestId('text-loop')).toHaveAttribute('data-hover-behavior', 'slowdown');
  expect(sectionQueries.getByTestId('text-loop')).toHaveAttribute('data-direction', 'right');
  expect(sectionQueries.getByTestId('text-loop')).toHaveAttribute('data-edge-mask', 'none');
  expect(primarySequence.getAllByText(conceptLoopSeparator).length).toBeGreaterThan(0);

  for (const item of conceptLoopItems) {
    expect(primarySequence.getAllByText(item).length).toBeGreaterThan(0);
  }

  expect(sectionQueries.queryAllByRole('link')).toHaveLength(0);
});
