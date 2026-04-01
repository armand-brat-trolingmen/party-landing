import { faqPlaceholderContent } from '../../data/siteContent';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './FaqSection.module.css';

export function FaqSection() {
  return (
    <section id="faq" className="site-section" data-testid="section-faq" aria-labelledby="faq-title">
      <div className="site-container">
        <article className={styles.frame}>
          <SectionHeading
            eyebrow={faqPlaceholderContent.eyebrow}
            title={<span id="faq-title">Частые вопросы</span>}
            description={faqPlaceholderContent.description}
          />
          <p className={styles.note}>{faqPlaceholderContent.note}</p>
        </article>
      </div>
    </section>
  );
}
