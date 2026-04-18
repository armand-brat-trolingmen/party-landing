import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { siteConfig } from '../../content';
import { useLeadForm } from '../../features/leads/useLeadForm';
import { LEAD_ATTRIBUTION_FIELDS } from '../../features/trafficSource/attribution';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './CtaSection.module.css';

const smartCaptchaScriptSrc = 'https://smartcaptcha.cloud.yandex.ru/captcha.js?render=onload';
let smartCaptchaScriptPromise: Promise<void> | null = null;

type SmartCaptchaRenderOptions = {
  sitekey: string;
  invisible: boolean;
  callback: (token: string) => void;
};

declare global {
  interface Window {
    smartCaptcha?: {
      render: (container: HTMLElement | string, options: SmartCaptchaRenderOptions) => number;
      execute: (widgetId?: number) => void;
    };
  }
}

type CtaSectionProps = {
  id?: string;
  title?: string;
  description?: string;
  sectionTestId?: string;
};

function getSmartCaptchaSiteKey() {
  return import.meta.env.VITE_SMARTCAPTCHA_SITE_KEY?.trim() ?? '';
}

function loadSmartCaptchaScript() {
  if (typeof window === 'undefined' || window.smartCaptcha) {
    return Promise.resolve();
  }

  if (smartCaptchaScriptPromise) {
    return smartCaptchaScriptPromise;
  }

  smartCaptchaScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${smartCaptchaScriptSrc}"]`);

    if (existingScript?.dataset.loaded === 'true') {
      resolve();
      return;
    }

    const script = existingScript ?? document.createElement('script');

    const handleLoad = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    const handleError = () => reject(new Error('SmartCaptcha script failed'));

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });

    script.src = smartCaptchaScriptSrc;
    script.async = true;
    script.defer = true;

    if (!existingScript) {
      document.head.appendChild(script);
    }
  }).catch((error) => {
    smartCaptchaScriptPromise = null;
    throw error;
  });

  return smartCaptchaScriptPromise;
}

function SmartCaptchaField({
  onToken,
  onExecuteReady,
}: {
  onToken: (token: string) => void;
  onExecuteReady: (execute: (() => void) | null) => void;
}) {
  const siteKey = getSmartCaptchaSiteKey();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!siteKey) {
      onExecuteReady(null);
      return undefined;
    }

    let isActive = true;

    void loadSmartCaptchaScript()
      .then(() => {
        if (!isActive || !containerRef.current || !window.smartCaptcha || widgetIdRef.current !== null) {
          return;
        }

        widgetIdRef.current = window.smartCaptcha.render(containerRef.current, {
          sitekey: siteKey,
          invisible: true,
          callback: onToken,
        });
        onExecuteReady(() => {
          if (widgetIdRef.current !== null) {
            window.smartCaptcha?.execute(widgetIdRef.current);
          }
        });
      })
      .catch(() => {
        if (isActive) {
          onExecuteReady(null);
        }
      });

    return () => {
      isActive = false;
      onExecuteReady(null);
      widgetIdRef.current = null;
    };
  }, [onExecuteReady, onToken, siteKey]);

  if (!siteKey) {
    return null;
  }

  return <div className={styles.smartCaptcha} ref={containerRef} data-testid="cta-smartcaptcha" />;
}

export function CtaSection({ id, title, description, sectionTestId = 'section-cta' }: CtaSectionProps) {
  const variant = 'home';
  const resolvedId = id ?? (sectionTestId === 'section-cta' ? 'cta' : undefined);
  const leadForm = useLeadForm();
  const executeSmartCaptchaRef = useRef<(() => void) | null>(null);
  const smartCaptchaSiteKey = getSmartCaptchaSiteKey();
  const [isCaptchaReady, setIsCaptchaReady] = useState(!Boolean(smartCaptchaSiteKey));
  const isSuccess = leadForm.status === 'success';
  const isError = leadForm.status === 'error' && Boolean(leadForm.statusMessage);

  useEffect(() => {
    setIsCaptchaReady(!Boolean(smartCaptchaSiteKey));
  }, [smartCaptchaSiteKey]);

  const handleSmartCaptchaToken = useCallback(
    (token: string) => {
      if (!token.trim()) {
        return;
      }

      void leadForm.submitWithSmartCaptchaToken(token);
    },
    [leadForm],
  );

  const handleSmartCaptchaExecuteReady = useCallback(
    (execute: (() => void) | null) => {
      executeSmartCaptchaRef.current = execute;
      setIsCaptchaReady(!smartCaptchaSiteKey || Boolean(execute));
    },
    [smartCaptchaSiteKey],
  );

  const handleSmartCaptchaSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      if (!smartCaptchaSiteKey) {
        void leadForm.handleSubmit(event);
        return;
      }

      event.preventDefault();

      if (!executeSmartCaptchaRef.current) {
        return;
      }

      executeSmartCaptchaRef.current();
    },
    [leadForm, smartCaptchaSiteKey],
  );

  const isNameInvalid = Boolean(leadForm.errors.name) || leadForm.hasGeneralError;
  const isPhoneInvalid = Boolean(leadForm.errors.phone) || leadForm.hasGeneralError;
  const isSubmitDisabled = leadForm.isSubmitDisabled || (Boolean(smartCaptchaSiteKey) && !isCaptchaReady);

  const body = (
    <>
      <div className={styles.content}>
        <div className={styles.copy}>
          <SectionHeading
            title={<span id={`${sectionTestId}-title`}>{title ?? siteConfig.homepage.cta.title}</span>}
            description={description ?? siteConfig.homepage.cta.description}
          />
        </div>

        <form className={styles.form} data-testid="cta-inline-form" onSubmit={handleSmartCaptchaSubmit} noValidate>
          <label className={styles.honeypot} aria-hidden="true">
            <span>Company</span>
            <input
              name="company"
              autoComplete="off"
              tabIndex={-1}
              value={leadForm.honeypotValue}
              onChange={leadForm.handleHoneypotChange}
            />
          </label>

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
              placeholder="+7 (999) 999-99-99"
              inputMode="tel"
              value={leadForm.values.phone}
              onChange={leadForm.handlePhoneChange}
              aria-invalid={isPhoneInvalid}
            />
          </label>

          {LEAD_ATTRIBUTION_FIELDS.map((field) => (
            <input key={field} type="hidden" name={field} value={leadForm.attributionValues[field] ?? ''} readOnly />
          ))}
          <input type="hidden" name="form_started_at" value={leadForm.formStartedAt} readOnly />
          <input type="hidden" name="smartcaptcha_token" value={leadForm.smartCaptchaToken} readOnly />

          {/* SmartCaptcha stays scoped to form submit instead of site-wide request blocking. */}
          <SmartCaptchaField onToken={handleSmartCaptchaToken} onExecuteReady={handleSmartCaptchaExecuteReady} />

          <button
            type="submit"
            className={`${styles.button} ${isSuccess ? styles.buttonSuccess : ''} ${isError ? styles.buttonError : ''}`}
            disabled={isSubmitDisabled}
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
            {leadForm.status === 'loading'
              ? 'Отправляем заявку'
              : isSuccess
                ? 'Заявка отправлена'
                : isError
                  ? 'Заявка не отправлена'
                  : ''}
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
