import { render, screen, within } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { faqItems } from '../../data/siteContent';
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
  expect(within(list).getAllByRole('listitem')).toHaveLength(faqItems.length);
  expect(buttons).toHaveLength(faqItems.length);
  expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
  expect(buttons[0]).toHaveAttribute('aria-controls', `faq-panel-${faqItems[0].id}`);

  const items = accordion.querySelectorAll('[data-motion-item="glow"]');
  expect(items).toHaveLength(faqItems.length);
  expect(items[0]).toHaveAttribute('data-open', 'true');
  expect(sectionQueries.getByText(faqItems[0].question)).toBeInTheDocument();
  expect(sectionQueries.getByText(faqItems[0].answer)).toBeInTheDocument();

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
        name: faqItems[0].question,
      }),
    ]),
  );
});
