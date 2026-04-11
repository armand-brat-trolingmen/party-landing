import { useState } from 'react';
import { siteConfig } from '../../content';
import { getFaqStructuredData } from '../../config/seo';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { StructuredData } from '../StructuredData';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './FaqSection.module.css';

export function FaqSection() {
  const { ref, revealState } = useScrollReveal();
  const { faq } = siteConfig.homepage;
  const [openItemId, setOpenItemId] = useState<string | null>(faq.items[0]?.id ?? null);

  return (
    <section id="faq" className="site-section" data-testid="section-faq" aria-labelledby="faq-title">
      <StructuredData data={getFaqStructuredData(faq.items)} />
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={styles.sectionBody}>
          <SectionHeading title={<span id="faq-title">{faq.title}</span>} description={faq.description} />
          <ul className={`${styles.accordion} reveal-grid`} data-testid="faq-accordion" data-motion-faq="cinematic" aria-label={faq.title}>
            {faq.items.map((item) => {
              const isOpen = item.id === openItemId;
              const answer = item.answer.trim();
              const panelId = `faq-panel-${item.id}`;
              const triggerId = `faq-trigger-${item.id}`;

              return (
                <li key={item.id} className={styles.item} data-open={isOpen ? 'true' : 'false'} data-motion-item="glow">
                  <h3 className={styles.questionHeading}>
                    <button
                      type="button"
                      id={triggerId}
                      className={styles.questionButton}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenItemId((current) => (current === item.id ? null : item.id))}
                    >
                      <span className={styles.questionText}>{item.question}</span>
                      <span className={styles.iconWrap} aria-hidden="true">
                        <span className={styles.iconLineHorizontal} />
                        <span className={styles.iconLineVertical} />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className={styles.answerPanel}
                    data-open={isOpen ? 'true' : 'false'}
                  >
                    <div className={styles.answerInner}>
                      {answer ? <p className={styles.answerText}>{answer}</p> : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
