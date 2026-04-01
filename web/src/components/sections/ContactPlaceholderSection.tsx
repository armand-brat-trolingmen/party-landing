import { contactPlaceholderContent } from '../../data/siteContent';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './ContactPlaceholderSection.module.css';

export function ContactPlaceholderSection() {
  return (
    <section id="contact" className="site-section" data-testid="section-contact" aria-labelledby="contact-title">
      <div className="site-container">
        <article className={styles.frame}>
          <SectionHeading
            eyebrow={contactPlaceholderContent.eyebrow}
            title={<span id="contact-title">Контакты</span>}
            description={contactPlaceholderContent.description}
          />
          <p className={styles.note}>{contactPlaceholderContent.note}</p>
        </article>
      </div>
    </section>
  );
}
