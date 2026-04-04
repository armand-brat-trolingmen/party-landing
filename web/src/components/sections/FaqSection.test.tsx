import { render, screen, within } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { FaqSection } from './FaqSection';

test('renders faq as a cinematic accordion with the first item open by default', () => {
  render(
    <HelmetProvider>
      <FaqSection />
    </HelmetProvider>,
  );

  const section = screen.getByTestId('section-faq');
  const sectionQueries = within(section);
  const accordion = sectionQueries.getByTestId('faq-accordion');
  const list = sectionQueries.getByRole('list');
  const buttons = sectionQueries.getAllByRole('button');

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Частые вопросы' })).toBeInTheDocument();
  expect(sectionQueries.queryByTestId('faq-pattern')).not.toBeInTheDocument();
  expect(accordion).toHaveAttribute('data-motion-faq', 'cinematic');
  expect(list).toBeInTheDocument();
  expect(within(list).getAllByRole('listitem')).toHaveLength(6);
  expect(buttons).toHaveLength(6);
  expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
  expect(buttons[0]).toHaveAttribute('aria-controls', 'faq-panel-events');

  const items = accordion.querySelectorAll('[data-motion-item="glow"]');
  expect(items).toHaveLength(6);
  expect(items[0]).toHaveAttribute('data-open', 'true');
  expect(sectionQueries.getByText(/какие форматы и услуги можно заказать/i)).toBeInTheDocument();
  expect(
    sectionQueries.getByText(/основной наш радиус — москва и московская область/i),
  ).toBeInTheDocument();

  const structuredDataNode = document.head.querySelector('script[type="application/ld+json"]');
  expect(structuredDataNode).not.toBeNull();

  const structuredData = JSON.parse(structuredDataNode?.textContent ?? '{}') as {
    '@type': string;
    mainEntity: Array<{ '@type': string; name: string }>;
  };

  expect(structuredData['@type']).toBe('FAQPage');
  expect(structuredData.mainEntity).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        '@type': 'Question',
        name: 'Какие форматы и услуги можно заказать на праздник?',
      }),
    ]),
  );
});
