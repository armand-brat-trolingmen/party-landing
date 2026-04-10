import { SiteShell } from '../components/layout/SiteShell';
import { SEO } from '../components/SEO';
import { siteConfig } from '../content';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './404.module.css';

export default function NotFoundPage() {
  const { notFound } = siteConfig;
  const { ref, revealState } = useScrollReveal<HTMLDivElement>({ rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  return (
    <>
      <SEO
        title={notFound.seoTitle}
        description={notFound.seoDescription}
        canonical={notFound.path}
        noindex
      />
      <SiteShell motionPath="lost-canvas" mainClassName={`site-shell ${styles.shell}`} legalMode>
        <section className={styles.page} aria-labelledby="not-found-title" data-testid="not-found-page">
          <div ref={ref} className={`site-container site-reveal ${styles.container}`} data-reveal-state={revealState} data-reveal-stagger="true">
            <div className={styles.copy}>
              <span className={styles.code} aria-hidden="true">
                {notFound.code}
              </span>
              <h1 id="not-found-title" className={styles.title}>
                {notFound.title}
              </h1>
              <p className={styles.description}>{notFound.description}</p>

              <nav className={styles.actions} aria-label="Навигация со страницы ошибки">
                <a className={styles.primaryAction} href={notFound.primaryAction.href}>
                  {notFound.primaryAction.label}
                </a>
                <a className={styles.secondaryAction} href={notFound.secondaryAction.href}>
                  {notFound.secondaryAction.label}
                </a>
              </nav>
            </div>
          </div>
        </section>
      </SiteShell>
    </>
  );
}
