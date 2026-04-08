import { footerContent, type LegalDocument } from '../../data/footerContent';
import { DonutLogo } from '../branding/DonutLogo';
import { SiteFooter } from '../layout/SiteFooter';
import { SEO } from '../SEO';
import styles from './LegalPageLayout.module.css';

type LegalPageLayoutProps = {
  document: LegalDocument;
};

export function LegalPageLayout({ document }: LegalPageLayoutProps) {
  return (
    <>
      <SEO title={document.seoTitle} description={document.description} canonical={document.path} />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.topBar}>
              <a className={styles.homeLink} href="/">
                <span className={styles.logoWrap} aria-hidden="true">
                  <DonutLogo size={30} />
                </span>
                <span>{footerContent.brand}</span>
              </a>
              <a className={styles.backLink} href="/">
                На главную
              </a>
            </div>

            <article className={`${styles.card} site-panel-glow`}>
              <div className={styles.heading}>
                <h1 className={styles.title}>{document.title}</h1>
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
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
