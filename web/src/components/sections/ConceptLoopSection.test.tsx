import { render, screen, within } from '@testing-library/react';
import { siteConfig } from '../../content';
import { ConceptLoopSection } from './ConceptLoopSection';

test('renders a decorative concept loop band with the stable shuffled phrases', () => {
  const conceptLoop = (
    siteConfig.homepage as {
      conceptLoop?: {
        separator: string;
        items: readonly string[];
      };
    }
  ).conceptLoop;

  expect(conceptLoop).toBeDefined();

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
  expect(primarySequence.getAllByText(conceptLoop?.separator ?? '').length).toBeGreaterThan(0);

  for (const item of conceptLoop?.items ?? []) {
    expect(primarySequence.getAllByText(item).length).toBeGreaterThan(0);
  }

  expect(sectionQueries.queryAllByRole('link')).toHaveLength(0);
});
