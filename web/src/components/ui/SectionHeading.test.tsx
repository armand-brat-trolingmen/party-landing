import { render, screen } from '@testing-library/react';
import { SectionHeading } from './SectionHeading';

test('renders semantic section heading content inside a header element', () => {
  const { container } = render(
    <SectionHeading eyebrow="Раздел" title="Заголовок" description="Описание" />,
  );

  expect(container.querySelector('header')).toBeInTheDocument();
  expect(screen.getByText('Раздел')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: 'Заголовок' })).toBeInTheDocument();
  expect(screen.getByText('Описание')).toBeInTheDocument();
});
