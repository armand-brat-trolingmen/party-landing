import { footerContent, type LegalDocument } from '../../data/footerContent';
import { SiteShell } from '../layout/SiteShell';
import { SEO } from '../SEO';
import styles from './LegalPageLayout.module.css';

type LegalPageLayoutProps = {
  document: LegalDocument;
};

export function LegalPageLayout({ document }: LegalPageLayoutProps) {
  return (
    <>
      <SEO title={document.seoTitle} description={document.description} canonical={document.path} />
      <SiteShell motionPath="story-trail" legalMode>
        <section className={`site-section ${styles.page}`} aria-labelledby="legal-page-title">
          <div className="site-container">
            <article className={`${styles.card} site-panel-glow`}>
              <div className={styles.heading}>
                <span className={styles.eyebrow}>{footerContent.brand}</span>
                <h1 id="legal-page-title" className={styles.title}>
                  {document.title}
                </h1>
              </div>

              <div className={styles.sheet} data-testid="legal-document-sheet" aria-label={document.title}>
                <div className={styles.sheetInner}>
                  <div className={styles.sheetHeader} aria-hidden="true">
                    <span className={styles.sheetDot} />
                    <span className={styles.sheetDot} />
                    <span className={styles.sheetDot} />
                  </div>

                  <div className={styles.sheetLines} data-testid="legal-document-lines" aria-hidden="true">
                    {Array.from({ length: 11 }, (_, index) => (
                      <span key={index} className={styles.sheetLine} />
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      </SiteShell>
    </>
  );
}
