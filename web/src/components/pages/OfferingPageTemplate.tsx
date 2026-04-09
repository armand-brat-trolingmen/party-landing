import { services, type OfferingEntity } from '../../data/catalogContent';
import { useOrderModal } from '../cta/useOrderModal';
import { ContactPlaceholderSection } from '../sections/ContactPlaceholderSection';
import { CtaSection } from '../sections/CtaSection';
import { ExtrasSection } from '../sections/ExtrasSection';
import { FaqSection } from '../sections/FaqSection';
import { ServicesSection } from '../sections/ServicesSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { OfferingVisual } from '../ui/OfferingVisual';
import styles from './OfferingPageTemplate.module.css';

type OfferingPageTemplateProps = {
  offering: OfferingEntity;
  typeLabel: string;
};

export function OfferingPageTemplate({ offering, typeLabel }: OfferingPageTemplateProps) {
  const { openModal } = useOrderModal();

  return (
    <>
      <section className={`site-section ${styles.leadSection}`} data-testid="section-offering-intro" aria-labelledby="offering-title">
        <div className="site-container">
          <article className={`${styles.leadFrame} site-panel-glow`}>
            <div className={styles.leadLayout}>
              <div className={styles.visualCard}>
                <OfferingVisual visual={offering.visual} label={offering.name} />
              </div>

              <div className={styles.copyCard}>
                <span className={styles.eyebrow}>{typeLabel}</span>
                <h1 id="offering-title" className={styles.title}>
                  {offering.name}
                </h1>
                <p className={styles.description}>{offering.fullDescription}</p>

                <div className={styles.metaRow}>
                  <span className={styles.priceBadge}>{offering.priceFrom}</span>
                  <button type="button" className={styles.orderButton} onClick={openModal}>
                    Заказать
                  </button>
                </div>

                <div className={styles.includedBlock}>
                  <h2 className={styles.includedTitle}>Что входит в формат</h2>
                  <ul className={styles.includedList}>
                    {offering.included.map((item) => (
                      <li key={item} className={styles.includedItem}>
                        <span className={styles.includedDot} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <ServicesSection allowReveal={false} items={services} />
      <ExtrasSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactPlaceholderSection />
      <CtaSection
        sectionTestId="section-offering-cta"
        title={`Нужна услуга «${offering.name}» на ваше событие?`}
        description="Оставьте имя и телефон — заказчик свяжется с вами, поможет уточнить детали и подскажет следующий шаг."
      />
    </>
  );
}
