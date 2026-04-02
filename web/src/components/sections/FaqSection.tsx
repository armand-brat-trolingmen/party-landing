import { useState } from 'react';
import { activeFaqVariant, faqItems, faqSectionCopy } from '../../data/siteContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './FaqSection.module.css';

export function FaqSection() {
  const { ref, revealState } = useScrollReveal();
  const [openItemId, setOpenItemId] = useState<string | null>(faqItems[0]?.id ?? null);
  const faqCopy = faqSectionCopy[activeFaqVariant];

  return (
    <section id="faq" className="site-section" data-testid="section-faq" aria-labelledby="faq-title">
      <div
        ref={ref}
        className="site-container site-reveal"
        data-reveal-state={revealState}
        data-reveal-stagger="true"
      >
        <article className={styles.frame}>
          <SectionHeading
            eyebrow={faqCopy.eyebrow}
            title={<span id="faq-title">Частые вопросы</span>}
            description={faqCopy.description}
          />
          {activeFaqVariant === 'accordion' ? (
            <div className={`${styles.accordion} reveal-grid`} data-testid="faq-accordion">
              {faqItems.map((item) => {
                const isOpen = item.id === openItemId;
                const panelId = `faq-panel-${item.id}`;
                const triggerId = `faq-trigger-${item.id}`;

                return (
                  <article key={item.id} className={styles.item} data-open={isOpen ? 'true' : 'false'}>
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
                        <p className={styles.answerText}>{item.answer}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className={`${styles.skeleton} reveal-grid`} data-testid="faq-pattern" aria-hidden="true">
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
          )}
        </article>
      </div>
    </section>
  );
}
