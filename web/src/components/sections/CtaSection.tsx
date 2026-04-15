import { siteConfig } from '../../content';
import { useLeadForm } from '../../features/leads/useLeadForm';
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
  const leadForm = useLeadForm();
  const feedbackStatus =
    leadForm.status === 'success' ? 'success' : leadForm.status === 'error' && leadForm.statusMessage ? 'error' : null;

  const isNameInvalid = Boolean(leadForm.errors.name) || leadForm.hasGeneralError;
  const isPhoneInvalid = Boolean(leadForm.errors.phone) || leadForm.hasGeneralError;

  const body = (
    <>
      <div className={styles.content}>
        <div className={styles.copy}>
          <SectionHeading
            title={<span id={`${sectionTestId}-title`}>{title ?? siteConfig.homepage.cta.title}</span>}
            description={description ?? siteConfig.homepage.cta.description}
          />
        </div>

        <form className={styles.form} data-testid="cta-inline-form" onSubmit={leadForm.handleSubmit} noValidate>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Имя</span>
            <input
              className={styles.input}
              name="name"
              autoComplete="name"
              maxLength={16}
              placeholder="Как к вам обращаться"
              value={leadForm.values.name}
              onChange={leadForm.handleNameChange}
              aria-invalid={isNameInvalid}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Телефон</span>
            <input
              className={styles.input}
              name="phone"
              autoComplete="tel"
              placeholder={siteConfig.contacts.phone.display}
              inputMode="tel"
              value={leadForm.values.phone}
              onChange={leadForm.handlePhoneChange}
              aria-invalid={isPhoneInvalid}
            />
          </label>

          <button type="submit" className={styles.button} disabled={leadForm.isSubmitDisabled}>
            {leadForm.submitLabel}
          </button>

          {feedbackStatus ? (
            <p
              className={`${styles.feedback} ${feedbackStatus === 'success' ? styles.feedbackSuccess : styles.feedbackError}`}
              aria-live="polite"
            >
              {leadForm.statusMessage}
            </p>
          ) : null}

          <span className={styles.visuallyHidden} aria-live="polite">
            {leadForm.status === 'loading' ? 'Отправляем заявку' : leadForm.status === 'success' ? 'Заявка отправлена' : ''}
          </span>
        </form>
      </div>

      <p className={styles.note}>
        Отправляя форму вы принимаете условия передачи данных и согласны с{' '}
        <a className={styles.noteLink} href="/privacy">
          политикой конфиденциальности
        </a>
        .
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
