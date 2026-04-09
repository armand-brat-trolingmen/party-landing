import { homePageContent } from '../../data/catalogContent';
import { footerContent } from '../../data/footerContent';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './CtaSection.module.css';

type CtaSectionProps = {
  id?: string;
  title?: string;
  description?: string;
  sectionTestId?: string;
};

export function CtaSection({ id, title, description, sectionTestId = 'section-cta' }: CtaSectionProps) {
  const variant = 'home';
  const resolvedId = id ?? (sectionTestId === 'section-cta' ? 'cta' : undefined);

  const body = (
    <>
      <div className={styles.content}>
        <div className={styles.copy}>
          <SectionHeading
            title={<span id={`${sectionTestId}-title`}>{title ?? homePageContent.cta.title}</span>}
            description={description ?? homePageContent.cta.description}
          />
        </div>

        <form className={styles.form} data-testid="cta-inline-form" onSubmit={(event) => event.preventDefault()}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Имя</span>
            <input className={styles.input} name="name" autoComplete="name" placeholder="Как к вам обращаться" />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Телефон</span>
            <input className={styles.input} name="phone" autoComplete="tel" placeholder="+79263919225" inputMode="tel" />
          </label>

          <button type="submit" className={styles.button}>
            {homePageContent.cta.actionLabel}
          </button>
        </form>
      </div>

      <p className={styles.note}>
        {homePageContent.cta.consentPrefix}{' '}
        {footerContent.legalLinks.map((legalLink, index) => (
          <span key={legalLink.href}>
            {index === footerContent.legalLinks.length - 1 && index > 0 ? 'и ' : null}
            <a className={styles.noteLink} href={legalLink.href}>
              {legalLink.label}
            </a>
            {index < footerContent.legalLinks.length - 2 ? ', ' : null}
            {index === footerContent.legalLinks.length - 2 ? ' ' : null}
            {index === footerContent.legalLinks.length - 1 ? '.' : null}
          </span>
        ))}
      </p>
    </>
  );

  return (
    <section
      id={resolvedId}
      className={`site-section ${styles.section}`}
      data-testid={sectionTestId}
      data-cta-variant={variant}
      aria-labelledby={`${sectionTestId}-title`}
    >
      <article className={`${styles.band} ${styles.homeBand}`} data-testid="cta-surface" data-cta-surface="full-bleed">
        <div className={`site-container ${styles.bandInner}`}>{body}</div>
      </article>
    </section>
  );
}
