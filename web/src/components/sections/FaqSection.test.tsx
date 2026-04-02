import { render, screen, within } from '@testing-library/react';
import { FaqSection } from './FaqSection';

test('renders faq as an animated accordion with the first answer open by default', () => {
  render(<FaqSection />);

  const section = screen.getByTestId('section-faq');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Частые вопросы' })).toBeInTheDocument();
  expect(sectionQueries.getByText('Собрали ответы на частые вопросы, чтобы вам было проще прикинуть формат ещё до звонка.')).toBeInTheDocument();
  expect(sectionQueries.queryByTestId('faq-pattern')).not.toBeInTheDocument();

  const firstQuestion = sectionQueries.getByRole('button', { name: 'На какие мероприятия вы выезжаете?' });
  expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
  expect(sectionQueries.getByText('От камерных дней рождения до офисных праздников, детских программ и городских событий — мы подключаемся там, где хочется собрать вокруг гостей живую атмосферу, а не просто поставить красивую точку с едой.')).toBeInTheDocument();

  expect(sectionQueries.getByRole('button', { name: 'Что можно арендовать для праздника?' })).toBeInTheDocument();
  expect(sectionQueries.getByRole('button', { name: 'Можно ли адаптировать формат под наш сценарий?' })).toBeInTheDocument();
  expect(sectionQueries.getByRole('button', { name: 'Работаете ли вы с офисными и детскими праздниками?' })).toBeInTheDocument();
  expect(sectionQueries.getByRole('button', { name: 'Что потребуется от площадки?' })).toBeInTheDocument();
  expect(sectionQueries.getByRole('button', { name: 'Выезжаете ли вы за пределы Москвы и области?' })).toBeInTheDocument();
});
