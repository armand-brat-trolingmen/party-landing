import { SectionHeading } from '../ui/SectionHeading';
import styles from './ContactPlaceholderSection.module.css';

export function ContactPlaceholderSection() {
  return (
    <section className="site-section" data-testid="section-contact" aria-labelledby="contact-title">
      <div className="site-container">
        <article id="contact" className={`${styles.frame} site-anchor`}>
          <SectionHeading title={<span id="contact-title">Контакты</span>} />
          <div className={styles.skeleton} data-testid="contact-pattern" aria-hidden="true">
            <div className={styles.form}>
              <div className={styles.field} />
              <div className={styles.field} />
              <div className={styles.fieldWide} />
              <div className={styles.ctaRow}>
                <div className={styles.button} />
                <div className={styles.hint} />
              </div>
            </div>
            <div className={styles.side}>
              <div className={styles.badgeRow}>
                <span className={styles.badge} />
                <span className={styles.badge} />
                <span className={styles.badge} />
              </div>
              <div className={styles.map} />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
