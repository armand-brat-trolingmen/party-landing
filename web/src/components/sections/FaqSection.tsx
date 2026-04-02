import { SectionHeading } from '../ui/SectionHeading';
import styles from './FaqSection.module.css';

export function FaqSection() {
  return (
    <section id="faq" className="site-section" data-testid="section-faq" aria-labelledby="faq-title">
      <div className="site-container">
        <article className={styles.frame}>
          <SectionHeading title={<span id="faq-title">Частые вопросы</span>} />
          <div className={styles.skeleton} data-testid="faq-pattern" aria-hidden="true">
            <div className={styles.row}>
              <span className={styles.chip} />
              <span className={styles.line} />
            </div>
            <div className={styles.row}>
              <span className={styles.chip} />
              <span className={styles.line} />
            </div>
            <div className={styles.row}>
              <span className={styles.chip} />
              <span className={styles.line} />
            </div>
            <div className={styles.row}>
              <span className={styles.chip} />
              <span className={styles.line} />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
