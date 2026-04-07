import { render, screen, within } from '@testing-library/react';
import { SiteFooter } from './SiteFooter';

test('renders compact footer with contact data, legal details, and legal links', () => {
  render(<SiteFooter />);

  const footer = screen.getByRole('contentinfo');

  expect(within(footer).getByText('Party Everyday')).toBeInTheDocument();
  expect(within(footer).getByRole('link', { name: 'Telegram' })).toHaveAttribute('href', '#telegram');
  expect(within(footer).getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', '#whatsapp');
  expect(within(footer).getByRole('link', { name: 'Avito' })).toHaveAttribute(
    'href',
    'https://www.avito.ru/brands/i82014135/all',
  );

  expect(within(footer).getByRole('link', { name: '+7 (999) 999-99-99' })).toHaveAttribute(
    'href',
    'tel:+79999999999',
  );
  expect(within(footer).getByRole('link', { name: 'contact@party-everyday.ru' })).toHaveAttribute(
    'href',
    'mailto:contact@party-everyday.ru',
  );

  expect(within(footer).getByText('ИП Гладышев Александр Андреевич')).toBeInTheDocument();
  expect(within(footer).getByText('ИНН 501806886358')).toBeInTheDocument();
  expect(within(footer).getByText('ОГРНИП 319508100076437')).toBeInTheDocument();
  expect(
    within(footer).getByText('Юр. адрес: М.о., г.о. Королев, пр-д Матроросова, д. 3 А, кв. 28.'),
  ).toBeInTheDocument();

  expect(within(footer).getByRole('link', { name: 'Политика конфиденциальности' })).toHaveAttribute('href', '/privacy');
  expect(within(footer).getByRole('link', { name: 'Пользовательское соглашение' })).toHaveAttribute('href', '/terms');
  expect(within(footer).getByRole('link', { name: 'Согласие на обработку персональных данных' })).toHaveAttribute(
    'href',
    '/consent',
  );
});
