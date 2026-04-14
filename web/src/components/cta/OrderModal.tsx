import { siteConfig } from '../../content';
import { useLeadForm } from '../../features/leads/useLeadForm';
import { useOrderModal } from './useOrderModal';
import styles from './OrderModal.module.css';

export function OrderModal() {
  const { isOpen, closeModal } = useOrderModal();
  const leadForm = useLeadForm();

  const handleClose = () => {
    leadForm.resetForm();
    closeModal();
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

        <form className={styles.form} onSubmit={leadForm.handleSubmit} noValidate>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Имя</span>
            <input
              className={styles.input}
              name="name"
              autoComplete="name"
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

          <button type="submit" className={styles.submitButton} disabled={leadForm.isSubmitDisabled}>
            {leadForm.submitLabel}
          </button>

          <span className={styles.visuallyHidden} aria-live="polite">
            {leadForm.status === 'loading' ? 'Отправляем заявку' : leadForm.status === 'success' ? 'Заявка отправлена' : ''}
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
