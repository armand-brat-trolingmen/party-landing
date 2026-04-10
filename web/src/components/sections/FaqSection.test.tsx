import { render, screen, within } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { siteConfig } from '../../content';
import { FaqSection } from './FaqSection';

test('renders faq as a cinematic accordion without a framed outer section shell', () => {
  const faq = (
    siteConfig.homepage as {
      faq?: {
        title: string;
        items: typeof siteConfig.homepage.faq.items;
      };
    }
  ).faq;

  expect(faq).toBeDefined();

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

  expect(sectionQueries.getByRole('heading', { level: 2, name: faq?.title })).toBeInTheDocument();
  expect(section).not.toHaveAttribute('data-section-tone');
  expect(accordion).toHaveAttribute('data-motion-faq', 'cinematic');
  expect(list).toBeInTheDocument();
  expect(within(list).getAllByRole('listitem')).toHaveLength(faq?.items.length ?? 0);
  expect(buttons).toHaveLength(faq?.items.length ?? 0);
  expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
  expect(buttons[0]).toHaveAttribute('aria-controls', `faq-panel-${faq?.items[0].id}`);

  const items = accordion.querySelectorAll('[data-motion-item="glow"]');
  expect(items).toHaveLength(faq?.items.length ?? 0);
  expect(items[0]).toHaveAttribute('data-open', 'true');
  expect(sectionQueries.getByText(faq?.items[0].question ?? '')).toBeInTheDocument();
  expect(sectionQueries.getByText(faq?.items[0].answer ?? '')).toBeInTheDocument();

  const structuredDataNode = section.querySelector('script[type="application/ld+json"][data-structured-data="true"]');
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
        name: faq?.items[0].question,
      }),
    ]),
  );
});
