import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { OrderModalProvider } from '../cta/OrderModalContext';
import { CtaSection } from './CtaSection';

test('renders the homepage CTA as a compact inline form with privacy consent link and capped name length', () => {
  render(
    <MemoryRouter>
      <OrderModalProvider>
        <CtaSection />
      </OrderModalProvider>
    </MemoryRouter>,
  );

  const section = screen.getByTestId('section-cta');
  const sectionQueries = within(section);

  expect(section).toHaveAttribute('data-cta-variant', 'home');
  expect(sectionQueries.getByTestId('cta-surface')).toHaveAttribute('data-cta-surface', 'full-bleed');
  expect(section.querySelector('[data-section-surface]')).toBeNull();
  expect(sectionQueries.getByTestId('cta-inline-form')).toBeInTheDocument();
  expect(sectionQueries.getByLabelText('Имя')).toHaveAttribute('maxlength', '16');
  expect(sectionQueries.getByLabelText('Телефон')).toBeInTheDocument();
  expect(sectionQueries.getByRole('button', { name: 'Заказать' })).toBeInTheDocument();
  expect(sectionQueries.queryByText(/whatsapp в течение 15 минут/i)).not.toBeInTheDocument();
  expect(sectionQueries.getByRole('link', { name: 'политикой конфиденциальности' })).toHaveAttribute('href', '/privacy');
  expect(sectionQueries.queryByRole('link', { name: /договор-оферта/i })).not.toBeInTheDocument();
  expect(sectionQueries.queryByRole('link', { name: /cookie/i })).not.toBeInTheDocument();
});
