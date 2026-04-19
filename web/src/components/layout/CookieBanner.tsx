import { useState, useSyncExternalStore } from 'react';
import { acceptCookieConsent, hasCookieConsent } from '../../features/cookies/consent';
import styles from './CookieBanner.module.css';

function subscribeCookieConsent() {
  return () => undefined;
}

export function CookieBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isReady = useSyncExternalStore(subscribeCookieConsent, () => true, () => false);
  const hasConsent = useSyncExternalStore(subscribeCookieConsent, hasCookieConsent, () => true);
  const isVisible = isReady && !isDismissed && !hasConsent;

  if (!isReady || !isVisible) {
    return null;
  }

  const handleAccept = () => {
    acceptCookieConsent();
    setIsDismissed(true);
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.banner} role="dialog" aria-label="Использование cookies">
        <div className={styles.copyBlock}>
          <p className={styles.copy}>
            {isExpanded ? (
              <>
                Продолжая использовать сайт, Вы соглашаетесь с использованием cookies,{' '}
                <a className={styles.link} href="/privacy/">
                  политикой конфиденциальности
                </a>{' '}
                и{' '}
                <a className={styles.link} href="/cookies/">
                  политикой использования cookie
                </a>
                , а также обработкой персональных данных, собираемых посредством метрической программы «Яндекс Метрика», в
                целях аналитики посещаемости сайта.
              </>
            ) : (
              <>
                Пользуясь сайтом, вы соглашаетесь с использованием cookies и{' '}
                <a className={styles.link} href="/privacy/">
                  политикой конфиденциальности
                </a>
                .
              </>
            )}
          </p>

          <button
            type="button"
            className={styles.detailsButton}
            onClick={() => setIsExpanded((current) => !current)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Скрыть' : 'Подробнее'}
          </button>
        </div>

        <button type="button" className={styles.acceptButton} onClick={handleAccept}>
          Хорошо
        </button>
      </section>
    </div>
  );
}
