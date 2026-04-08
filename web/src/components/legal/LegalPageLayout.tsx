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
                <p className="site-section__eyebrow">Правовая информация</p>
                <h1 className={styles.title}>{document.title}</h1>
                <p className={styles.lead}>{document.intro}</p>
              </div>

              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Актуально на {document.updatedAt}</span>
                <span className={styles.metaDivider} aria-hidden="true" />
                <span className={styles.metaText}>{footerContent.businessName}</span>
              </div>

              <div className={styles.sections}>
                {document.sections.map((section) => (
                  <section key={section.title} className={styles.section}>
                    <h2 className={styles.sectionTitle}>{section.title}</h2>
                    <div className={styles.sectionBody}>
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {section.items ? (
                        <ul className={styles.sectionList}>
                          {section.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
