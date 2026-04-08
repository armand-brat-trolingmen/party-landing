import { render, screen } from '@testing-library/react';
import { SectionHeading } from './SectionHeading';

test('renders a single section title with alignment metadata', () => {
  render(<SectionHeading title="Heading" description="Description" align="center" />);

  const title = screen.getByRole('heading', { level: 2, name: 'Heading' });

  expect(title).toBeInTheDocument();
  expect(title.closest('header')).toHaveAttribute('data-heading-align', 'center');
  expect(screen.getByText('Description')).toBeInTheDocument();
  expect(screen.queryByText('Section')).not.toBeInTheDocument();
});
