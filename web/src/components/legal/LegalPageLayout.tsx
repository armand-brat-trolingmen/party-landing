import type { LegalDocument } from '../../content/types';
import { siteConfig } from '../../content';
import { SiteShell } from '../layout/SiteShell';
import { SEO } from '../SEO';
import styles from './LegalPageLayout.module.css';

type LegalPageLayoutProps = {
  document: LegalDocument;
};

function LegalDocumentBody({ document }: { document: LegalDocument }) {
  return (
    <div className={styles.sheetBody} data-testid="legal-document-body">
      {document.intro.length ? (
        <div className={styles.intro}>
          {document.intro.map((block, index) => {
            if (block.kind === 'list') {
              return (
                <ul key={`intro-list-${index}`} className={styles.list}>
                  {block.items.map((item) => (
                    <li key={item} className={styles.listItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={`intro-paragraph-${index}`} className={styles.paragraph}>
                {block.text}
              </p>
            );
          })}
        </div>
      ) : null}

      {document.sections.map((section, index) => (
        <section key={section.title} className={styles.documentSection} aria-labelledby={`legal-section-${index}`}>
          <h2 id={`legal-section-${index}`} className={styles.sectionTitle}>
            {section.title}
          </h2>

          <div className={styles.sectionContent}>
            {section.blocks.map((block, index) => {
              if (block.kind === 'list') {
                return (
                  <ul key={`${section.title}-list-${index}`} className={styles.list}>
                    {block.items.map((item) => (
                      <li key={item} className={styles.listItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={`${section.title}-paragraph-${index}`} className={styles.paragraph}>
                  {block.text}
                </p>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export function LegalPageLayout({ document }: LegalPageLayoutProps) {
  return (
    <>
      <SEO title={document.seoTitle} description={document.description} canonical={document.path} />
      <SiteShell motionPath="story-trail" legalMode>
        <section className={`site-section ${styles.page}`} aria-labelledby="legal-page-title">
          <div className="site-container">
            <article className={`${styles.card} site-panel-glow`}>
              <div className={styles.heading}>
                <span className={styles.eyebrow}>{siteConfig.brand.name}</span>
                <h1 id="legal-page-title" className={styles.title}>
                  {document.title}
                </h1>
              </div>

              <div className={styles.sheet} data-testid="legal-document-sheet" aria-label={document.title}>
                <div className={styles.sheetInner}>
                  <LegalDocumentBody document={document} />
                </div>
              </div>
            </article>
          </div>
        </section>
      </SiteShell>
    </>
  );
}
