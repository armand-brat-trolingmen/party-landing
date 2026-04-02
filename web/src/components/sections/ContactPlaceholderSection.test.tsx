import { render, screen, within } from '@testing-library/react';
import { ContactPlaceholderSection } from './ContactPlaceholderSection';

test('renders contact section as a final note instead of the old placeholder panel', () => {
  render(<ContactPlaceholderSection />);

  const section = screen.getByTestId('section-contact');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Контакты' })).toBeInTheDocument();
  expect(sectionQueries.queryByTestId('contact-pattern')).not.toBeInTheDocument();
  expect(
    sectionQueries.getByText(
      'Это лишь 10% от того, что я видел в своей голове, и сделать я готов как угодно: от смены дизайна и стилистики до смены концепции сайта — от визитной карточки до чего-то другого и автоматического приема заказов с сайта с последующей переадресацией заказа куда надо, спасибо за то что посмотрели))',
    ),
  ).toBeInTheDocument();
});
