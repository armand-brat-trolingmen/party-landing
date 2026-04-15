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
  const isSuccess = leadForm.status === 'success';
  const isError = leadForm.status === 'error' && Boolean(leadForm.statusMessage);

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

          <button
            type="submit"
            className={`${styles.button} ${isSuccess ? styles.buttonSuccess : ''} ${isError ? styles.buttonError : ''}`}
            disabled={leadForm.isSubmitDisabled}
          >
            {isSuccess ? (
              <span className={styles.buttonStateContent}>
                <span className={`${styles.buttonStateIcon} ${styles.buttonStateIconSuccess}`} data-testid="cta-submit-success-icon" aria-hidden="true">
                  <span className={styles.buttonStateMark}>✓</span>
                </span>
                <span>Успешно</span>
              </span>
            ) : isError ? (
              <span className={styles.buttonStateContent}>
                <span className={`${styles.buttonStateIcon} ${styles.buttonStateIconError}`} data-testid="cta-submit-error-icon" aria-hidden="true">
                  <span className={styles.buttonStateMark}>×</span>
                </span>
                <span>Неуспешно</span>
              </span>
            ) : (
              leadForm.submitLabel
            )}
          </button>

          {isError ? (
            <p className={`${styles.feedback} ${styles.feedbackError}`} aria-live="polite">
              {leadForm.statusMessage}
            </p>
          ) : null}

          <span className={styles.visuallyHidden} aria-live="polite">
            {leadForm.status === 'loading' ? 'Отправляем заявку' : isSuccess ? 'Заявка отправлена' : isError ? 'Заявка не отправлена' : ''}
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
