import { useEffect, useState } from 'react';
import { acceptCookieConsent, hasCookieConsent } from '../../features/cookies/consent';
import styles from './CookieBanner.module.css';

export function CookieBanner() {
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsReady(true);
    setIsVisible(!hasCookieConsent());
  }, []);

  if (!isReady || !isVisible) {
    return null;
  }

  const handleAccept = () => {
    acceptCookieConsent();
    setIsVisible(false);
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.banner} role="dialog" aria-label="Использование cookies">
        <div className={styles.copyBlock}>
          <p className={styles.copy}>
            {isExpanded ? (
              <>
                Продолжая использовать сайт, Вы соглашаетесь с использованием cookies,{' '}
                <a className={styles.link} href="/privacy">
                  политикой конфиденциальности
                </a>{' '}
                и{' '}
                <a className={styles.link} href="/cookies">
                  политикой использования cookie
                </a>
                , а также обработкой персональных данных, собираемых посредством метрической программы «Яндекс Метрика», в
                целях аналитики посещаемости сайта.
              </>
            ) : (
              <>
                Пользуясь сайтом, вы соглашаетесь с использованием cookies и{' '}
                <a className={styles.link} href="/privacy">
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
