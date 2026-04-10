import { siteConfig } from '../../content';
import { homePageContent } from '../../data/catalogContent';
import { useOrderModal } from './useOrderModal';
import styles from './OrderModal.module.css';

export function OrderModal() {
  const { isOpen, closeModal } = useOrderModal();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={closeModal}
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

          <button type="button" className={styles.closeButton} onClick={closeModal} aria-label="Закрыть форму заказа">
            Г—
          </button>
        </div>

        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Имя</span>
            <input className={styles.input} name="name" autoComplete="name" placeholder="Как к вам обращаться" />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Телефон</span>
            <input className={styles.input} name="phone" autoComplete="tel" placeholder={siteConfig.contacts.phone.display} inputMode="tel" />
          </label>

          <button type="submit" className={styles.submitButton}>
            {homePageContent.cta.actionLabel}
          </button>
        </form>

        <p className={styles.consent}>
          {homePageContent.cta.consentPrefix}{' '}
          <span className={styles.consentLinks}>
            {siteConfig.legal.links.map((link, index) => (
              <span key={link.href}>
                {index > 0 ? 'и ' : null}
                <a className={styles.consentLink} href={link.href}>
                  {link.label.toLowerCase()}
                </a>
                {index < siteConfig.legal.links.length - 1 ? ' ' : null}
              </span>
            ))}
          </span>
          .
        </p>
      </div>
    </div>
  );
}
