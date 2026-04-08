import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { OrderModalProvider } from '../cta/OrderModalContext';
import { CtaSection } from './CtaSection';

test('renders the homepage CTA as a compact inline form with legal links', () => {
  render(
    <MemoryRouter>
      <OrderModalProvider>
        <CtaSection />
      </OrderModalProvider>
    </MemoryRouter>,
  );

  const section = screen.getByTestId('section-cta');
  const sectionQueries = within(section);
  const surface = section.querySelector('[data-section-surface="band"][data-section-tone="apricot"]');

  expect(surface).not.toBeNull();
  expect(sectionQueries.getByTestId('cta-inline-form')).toBeInTheDocument();
  expect(sectionQueries.getByLabelText('Имя')).toBeInTheDocument();
  expect(sectionQueries.getByLabelText('Телефон')).toBeInTheDocument();
  expect(sectionQueries.getByRole('button', { name: 'Заказать' })).toBeInTheDocument();
  expect(sectionQueries.getByRole('link', { name: 'Политика конфиденциальности' })).toHaveAttribute('href', '/privacy');
  expect(sectionQueries.getByRole('link', { name: 'Пользовательское соглашение' })).toHaveAttribute('href', '/terms');
  expect(sectionQueries.getByRole('link', { name: 'Согласие на обработку персональных данных' })).toHaveAttribute(
    'href',
    '/consent',
  );
});
