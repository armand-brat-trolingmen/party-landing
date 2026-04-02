import { SectionHeading } from '../ui/SectionHeading';
import styles from './FaqSection.module.css';

export function FaqSection() {
  return (
    <section className="site-section" data-testid="section-faq" aria-labelledby="faq-title">
      <div className="site-container">
        <article id="faq" className={`${styles.frame} site-anchor`}>
          <SectionHeading
            title={<span id="faq-title">Частые вопросы</span>}
          />
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
