import { footerContent, type FooterSocialLink } from '../../data/footerContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { DonutLogo } from '../branding/DonutLogo';
import styles from './SiteFooter.module.css';

function FooterSocialIcon({ id }: { id: FooterSocialLink['id'] }) {
  if (id === 'telegram') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M19.7 5.3 17.4 18c-.2 1-1 1.2-1.8.8l-3.5-2.6-1.7 1.6c-.2.2-.3.3-.7.3l.3-3.6 6.7-6.1c.3-.2-.1-.4-.4-.2L8.1 13 4.7 11.9c-.8-.3-.8-.8.2-1.2l13.4-5.1c.6-.2 1.6 0 1.4.7Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (id === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12.1 4.2a7.7 7.7 0 0 0-6.6 11.6l-.9 3.2 3.3-.9a7.7 7.7 0 1 0 4.2-13.9Zm4.5 10.8c-.2.5-1.2 1-1.7 1.1-.4.1-1 .2-3.2-.7-2.6-1.1-4.3-3.8-4.4-4-.2-.2-1-1.3-1-2.5 0-1.3.7-1.9.9-2.2.2-.2.5-.3.7-.3h.5c.2 0 .5 0 .7.5.2.5.8 1.7.8 1.8.1.2.1.4 0 .6-.1.2-.2.4-.4.6l-.3.4c-.2.2-.3.4-.1.7.2.4.8 1.3 1.8 2 .2.2 1.5 1.2 2.6 1.6.4.2.6.2.9-.1l.7-.9c.2-.3.5-.3.8-.2.3.1 1.8.9 2.1 1 .3.2.5.3.5.5 0 .2-.2.9-.4 1.3Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="6.2" cy="12" r="2.8" fill="#3F8CFF" />
      <circle cx="12" cy="7.2" r="2.8" fill="#8CC341" />
      <circle cx="12.8" cy="16.6" r="2.6" fill="#FF5555" />
      <circle cx="17.7" cy="11.4" r="2.5" fill="#232323" />
    </svg>
  );
}

export function SiteFooter() {
  const { ref, revealState } = useScrollReveal<HTMLDivElement>({ rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

  return (
    <footer className={styles.footer} data-testid="site-footer">
      <div
        ref={ref}
        className={`site-container site-reveal ${styles.inner}`}
        data-reveal-state={revealState}
        data-reveal-stagger="true"
      >
        <div className={styles.topRow}>
          <div className={styles.brandCluster}>
            <a className={styles.brand} href="/" aria-label={footerContent.brand}>
              <span className={styles.brandBadge} aria-hidden="true">
                <DonutLogo size={34} />
              </span>
              <span className={styles.brandName}>{footerContent.brand}</span>
            </a>
            <p className={styles.brandDescriptor}>{footerContent.descriptor}</p>
          </div>

          <div className={styles.actionsCluster}>
            <div className={styles.socials} aria-label="Соцсети и мессенджеры">
              {footerContent.socialLinks.map((socialLink) => (
                <a
                  key={socialLink.id}
                  className={styles.socialLink}
                  href={socialLink.href}
                  aria-label={socialLink.label}
                  rel={socialLink.id === 'avito' ? 'noreferrer' : undefined}
                  target={socialLink.id === 'avito' ? '_blank' : undefined}
                >
                  <FooterSocialIcon id={socialLink.id} />
                </a>
              ))}
            </div>

            <div className={styles.contactLinks}>
              <a className={styles.contactLink} href={footerContent.phoneHref}>
                {footerContent.phoneLabel}
              </a>
              <a className={styles.contactLink} href={footerContent.emailHref}>
                {footerContent.emailLabel}
              </a>
            </div>
          </div>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.bottomRow}>
          <div className={styles.legalDetails}>
            <p>{footerContent.businessName}</p>
            <p>{footerContent.inn}</p>
            <p>{footerContent.ogrnip}</p>
            <p>{footerContent.legalAddress}</p>
          </div>

          <div className={styles.legalLinks}>
            {footerContent.legalLinks.map((legalLink) => (
              <a key={legalLink.href} className={styles.legalLink} href={legalLink.href}>
                {legalLink.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
