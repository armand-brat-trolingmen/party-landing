import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './ContactPlaceholderSection.module.css';

export function ContactPlaceholderSection() {
  const { ref, revealState } = useScrollReveal();

  return (
    <section id="contact" className="site-section" data-testid="section-contact" aria-labelledby="contact-title">
      <div
        ref={ref}
        className="site-container site-reveal"
        data-reveal-state={revealState}
        data-reveal-stagger="true"
      >
        <article className={`${styles.frame} site-panel-glow`}>
          <SectionHeading title={<span id="contact-title">Контакты</span>} />
          <div className={`${styles.noteCard} reveal-grid`} data-testid="contact-note">
            <p className={styles.noteText}>
              Это лишь 10% от того, что я видел в своей голове, и сделать я готов как угодно: от смены
              дизайна и стилистики до смены концепции сайта — от визитной карточки до чего-то другого и
              автоматического приема заказов с сайта с последующей переадресацией заказа куда надо,
              спасибо за то что посмотрели))
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
