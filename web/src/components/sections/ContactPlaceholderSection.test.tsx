import { render, screen, within } from '@testing-library/react';
import { ContactPlaceholderSection } from './ContactPlaceholderSection';

test('renders contacts as a guided practical block with messenger icons and first-message prompts', () => {
  render(<ContactPlaceholderSection />);

  const section = screen.getByTestId('section-contact');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Контакты' })).toBeInTheDocument();
  expect(sectionQueries.getByTestId('contact-layout')).toHaveAttribute('data-contact-layout', 'guided');
  expect(sectionQueries.getByTestId('contact-guide')).toHaveAttribute('data-contact-guide', 'first-message');
  expect(sectionQueries.getByText('Что удобно написать сразу')).toBeInTheDocument();
  expect(sectionQueries.getByText('Дата и ориентир по времени')).toBeInTheDocument();
  expect(sectionQueries.getByText('Формат события и площадка')).toBeInTheDocument();
  expect(sectionQueries.getByText('Количество гостей и желаемые зоны')).toBeInTheDocument();
  expect(
    sectionQueries.getByText(
      'Добрый день! Планируем событие в Москве, ориентир — 60 гостей. Интересны фудтрак и сладкая зона. Подскажите, какие требования к площадке для данных услуг?',
    ),
  ).toBeInTheDocument();
  expect(sectionQueries.queryByText('Москва и МО')).not.toBeInTheDocument();

  expect(sectionQueries.getByRole('link', { name: 'Telegram' })).toHaveAttribute('href', '#telegram');
  expect(sectionQueries.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', '#whatsapp');
  expect(sectionQueries.getByRole('link', { name: 'Avito' })).toHaveAttribute(
    'href',
    'https://www.avito.ru/brands/i82014135/all',
  );

  expect(sectionQueries.getByTestId('contact-icon-telegram')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('contact-icon-whatsapp')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('contact-icon-avito')).toBeInTheDocument();
});
