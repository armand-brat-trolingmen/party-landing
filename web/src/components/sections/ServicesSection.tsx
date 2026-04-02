import { services } from '../../data/siteContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './ServicesSection.module.css';

export function ServicesSection() {
  const { ref, revealState } = useScrollReveal();

  return (
    <section id="services" className="site-section" data-testid="section-services" aria-labelledby="services-title">
      <div
        ref={ref}
        className="site-container site-reveal"
        data-reveal-state={revealState}
        data-reveal-stagger="true"
      >
        <div className={`${styles.frame} site-panel-glow`}>
          <SectionHeading
            eyebrow="Что мы делаем"
            title={<span id="services-title">Услуги</span>}
            description="Четыре выразительных формата для сладкого, подвижного и фотогеничного праздника без перегруженной сцены."
          />

          <div className={`${styles.strip} reveal-grid`} data-testid="services-strip" data-scroll-snap="x">
            {services.map((service) => (
              <article
                key={service.id}
                className={styles.card}
                data-service-id={service.id}
                data-motion-service="micro-scene"
              >
                <div className={styles.imageWrap} data-service-scene={service.id}>
                  <div className={styles.imageMotion} data-motion-image="true">
                    <img
                      src={service.image}
                      alt={service.name}
                      className={styles.image}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                  </div>
                </div>
                <h3 className={styles.name}>{service.name}</h3>
                <p className={styles.description}>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
