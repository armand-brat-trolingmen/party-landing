import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../../content';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './ContactPlaceholderSection.module.css';

const AVITO_SCREENSHOT_SRC = '/images/contact/avito.jpg';

type ContactIconKind = 'telegram' | 'whatsapp' | 'avito';

function ContactServiceIcon({ kind }: { kind: ContactIconKind }) {
  if (kind === 'telegram') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" data-testid="contact-icon-telegram">
        <path
          d="M19.7 5.3 17.4 18c-.2 1-1 1.2-1.8.8l-3.5-2.6-1.7 1.6c-.2.2-.3.3-.7.3l.3-3.6 6.7-6.1c.3-.2-.1-.4-.4-.2L8.1 13 4.7 11.9c-.8-.3-.8-.8.2-1.2l13.4-5.1c.6-.2 1.6 0 1.4.7Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (kind === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" data-testid="contact-icon-whatsapp">
        <path
          d="M12.1 4.2a7.7 7.7 0 0 0-6.6 11.6l-.9 3.2 3.3-.9a7.7 7.7 0 1 0 4.2-13.9Zm4.5 10.8c-.2.5-1.2 1-1.7 1.1-.4.1-1 .2-3.2-.7-2.6-1.1-4.3-3.8-4.4-4-.2-.2-1-1.3-1-2.5 0-1.3.7-1.9.9-2.2.2-.2.5-.3.7-.3h.5c.2 0 .5 0 .7.5.2.5.8 1.7.8 1.8.1.2.1.4 0 .6-.1.2-.2.4-.4.6l-.3.4c-.2.2-.3.4-.1.7.2.4.8 1.3 1.8 2 .2.2 1.5 1.2 2.6 1.6.4.2.6.2.9-.1l.7-.9c.2-.3.5-.3.8-.2.3.1 1.8.9 2.1 1 .3.2.5.3.5.5 0 .2-.2.9-.4 1.3Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" data-testid="contact-icon-avito">
      <circle cx="6.2" cy="12" r="2.8" fill="#3F8CFF" />
      <circle cx="12" cy="7.2" r="2.8" fill="#8CC341" />
      <circle cx="12.8" cy="16.6" r="2.6" fill="#FF5555" />
      <circle cx="17.7" cy="11.4" r="2.5" fill="#232323" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" data-testid="contact-icon-phone">
      <path
        d="M7.1 4.6c.4-.4 1-.6 1.5-.4l2 .7c.6.2.9.8.8 1.3l-.4 2a1.4 1.4 0 0 1-1 .9l-1 .2a12 12 0 0 0 5.8 5.8l.2-1a1.4 1.4 0 0 1 .9-1l2-.4c.6-.1 1.1.2 1.3.8l.7 2c.2.5 0 1.1-.4 1.5l-1.3 1.3c-.8.8-2 1.1-3.1.7a18.8 18.8 0 0 1-9.7-9.7c-.4-1.1-.1-2.3.7-3.1l1.3-1.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" data-testid="contact-icon-email">
      <path
        d="M5.3 6.5h13.4c.9 0 1.6.7 1.6 1.6v7.8c0 .9-.7 1.6-1.6 1.6H5.3c-.9 0-1.6-.7-1.6-1.6V8.1c0-.9.7-1.6 1.6-1.6Zm.8 1.8 5.9 4.4 5.9-4.4H6.1Zm12.1 7.4V9.5l-5.3 4a1.5 1.5 0 0 1-1.8 0l-5.3-4v6.2h12.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ContactPlaceholderSection() {
  const { ref, revealState } = useScrollReveal();
  const { contact } = siteConfig.homepage;
  const [isAvitoPreviewOpen, setIsAvitoPreviewOpen] = useState(false);
  const avitoPreviewTriggerRef = useRef<HTMLButtonElement>(null);
  const avitoPreviewCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isAvitoPreviewOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const avitoPreviewTrigger = avitoPreviewTriggerRef.current;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsAvitoPreviewOpen(false);
      }
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    avitoPreviewCloseRef.current?.focus();

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      avitoPreviewTrigger?.focus();
    };
  }, [isAvitoPreviewOpen]);

  function closeAvitoPreview() {
    setIsAvitoPreviewOpen(false);
  }

  return (
    <section id="contact" className="site-section" data-testid="section-contact" aria-labelledby="contact-title">
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={styles.sectionBody}>
          <SectionHeading title={<span id="contact-title">{contact.title}</span>} description={contact.description} />

          <div className={`${styles.layout} reveal-grid`} data-testid="contact-layout" data-contact-layout="split-canvas">
            <div className={styles.copy}>
              <div className={styles.details}>
                <a className={styles.contactItem} href={siteConfig.contacts.phone.href} aria-label={siteConfig.contacts.phone.display}>
                  <span className={styles.contactBadge}>
                    <PhoneIcon />
                  </span>
                  <span className={styles.contactTextWrap}>
                    <span className={styles.contactLabel}>Телефон</span>
                    <span className={styles.contactLink}>{siteConfig.contacts.phone.display}</span>
                  </span>
                </a>

                <a className={styles.contactItem} href={siteConfig.contacts.email.href} aria-label={siteConfig.contacts.email.display}>
                  <span className={styles.contactBadge}>
                    <EmailIcon />
                  </span>
                  <span className={styles.contactTextWrap}>
                    <span className={styles.contactLabel}>Почта</span>
                    <span className={styles.contactLink}>{siteConfig.contacts.email.display}</span>
                  </span>
                </a>
              </div>

              <div className={styles.socialBlock}>
                <h3 className={styles.socialTitle}>Социальные сети и мессенджеры</h3>
                <div className={styles.socialList}>
                  {contact.actions.map((action) => (
                    <a
                      key={action.id}
                      className={styles.socialLink}
                      href={action.href}
                      aria-label={action.label}
                      target={action.id === 'avito' ? '_blank' : undefined}
                      rel={action.id === 'avito' ? 'noreferrer' : undefined}
                    >
                      <ContactServiceIcon kind={action.icon} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <figure className={styles.visualSlot} data-testid="contact-visual-slot" data-contact-visual="avito">
              <button
                ref={avitoPreviewTriggerRef}
                type="button"
                className={styles.visualButton}
                aria-label="Открыть скриншот Avito на весь экран"
                onClick={() => setIsAvitoPreviewOpen(true)}
              >
                <img
                  className={styles.visualImage}
                  src={AVITO_SCREENSHOT_SRC}
                  alt="Профиль Праздник каждый день на Avito"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            </figure>
          </div>
        </div>
      </div>

      {isAvitoPreviewOpen ? (
        <div
          className={styles.visualDialogOverlay}
          role="presentation"
          onClick={closeAvitoPreview}
          data-testid="contact-visual-dialog-overlay"
          data-dialog-state="open"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Скриншот Avito"
            className={styles.visualDialog}
            data-testid="contact-visual-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.visualDialogHeader}>
              <button
                ref={avitoPreviewCloseRef}
                type="button"
                className={styles.visualDialogClose}
                onClick={closeAvitoPreview}
                aria-label="Закрыть скриншот Avito"
              >
                ×
              </button>
            </div>
            <img
              className={styles.visualDialogImage}
              src={AVITO_SCREENSHOT_SRC}
              alt="Скриншот профиля Праздник каждый день на Avito"
              decoding="async"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
