import { useCallback, useEffect, useRef, type FormEvent } from 'react';
import { LEAD_ATTRIBUTION_FIELDS } from '../../features/trafficSource/attribution';
import { useLeadForm } from '../../features/leads/useLeadForm';
import { useOrderModal } from './useOrderModal';
import styles from './OrderModal.module.css';

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
    const script = existingScript ?? document.createElement('script');

    script.src = smartCaptchaScriptSrc;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('SmartCaptcha script failed'));

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

  return <div className={styles.smartCaptcha} ref={containerRef} data-testid="order-modal-smartcaptcha" />;
}

export function OrderModal() {
  const { isOpen, closeModal } = useOrderModal();
  const leadForm = useLeadForm();
  const executeSmartCaptchaRef = useRef<(() => void) | null>(null);
  const isSuccess = leadForm.status === 'success';
  const isError = leadForm.status === 'error' && Boolean(leadForm.statusMessage);
  const smartCaptchaSiteKey = getSmartCaptchaSiteKey();

  const handleSmartCaptchaToken = useCallback(
    (token: string) => {
      if (!token.trim()) {
        return;
      }

      void leadForm.submitWithSmartCaptchaToken(token);
    },
    [leadForm],
  );

  const handleSmartCaptchaExecuteReady = useCallback((execute: (() => void) | null) => {
    executeSmartCaptchaRef.current = execute;
  }, []);

  const handleClose = () => {
    leadForm.resetForm();
    closeModal();
  };

  const handleSmartCaptchaSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!smartCaptchaSiteKey) {
      void leadForm.handleSubmit(event);
      return;
    }

    event.preventDefault();

    if (!executeSmartCaptchaRef.current) {
      return;
    }

    executeSmartCaptchaRef.current();
  };

  if (!isOpen) {
    return null;
  }

  const isNameInvalid = Boolean(leadForm.errors.name) || leadForm.hasGeneralError;
  const isPhoneInvalid = Boolean(leadForm.errors.phone) || leadForm.hasGeneralError;

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={handleClose}
      data-testid="order-modal-overlay"
      data-modal-state="open"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        className={styles.dialog}
        data-testid="order-modal"
        data-modal-state="open"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 id="order-modal-title" className={styles.title}>
              Оставьте имя и телефон
            </h2>
            <p className={styles.description}>
              Свяжемся с вами, поможем подобрать формат мероприятия и подскажем, как аккуратно встроить его в площадку.
            </p>
          </div>

          <button type="button" className={styles.closeButton} onClick={handleClose} aria-label="Закрыть форму заказа">
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSmartCaptchaSubmit} noValidate>
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

          {/* SmartCaptcha stays scoped to lead form submit and does not affect indexable pages globally. */}
          <SmartCaptchaField
            onToken={handleSmartCaptchaToken}
            onExecuteReady={handleSmartCaptchaExecuteReady}
          />

          <button
            type="submit"
            className={`${styles.submitButton} ${isSuccess ? styles.submitButtonSuccess : ''} ${isError ? styles.submitButtonError : ''}`}
            disabled={leadForm.isSubmitDisabled}
          >
            {isSuccess ? (
              <span className={styles.buttonStateContent}>
                <span
                  className={`${styles.buttonStateIcon} ${styles.buttonStateIconSuccess}`}
                  data-testid="order-modal-submit-success-icon"
                  aria-hidden="true"
                >
                  <span className={styles.buttonStateMark}>✓</span>
                </span>
                <span>Успешно</span>
              </span>
            ) : isError ? (
              <span className={styles.buttonStateContent}>
                <span
                  className={`${styles.buttonStateIcon} ${styles.buttonStateIconError}`}
                  data-testid="order-modal-submit-error-icon"
                  aria-hidden="true"
                >
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

        <p className={styles.consent}>
          Отправляя форму вы принимаете условия передачи данных и согласны с{' '}
          <a className={styles.consentLink} href="/privacy">
            политикой конфиденциальности
          </a>
          .
        </p>
      </div>
    </div>
  );
}
