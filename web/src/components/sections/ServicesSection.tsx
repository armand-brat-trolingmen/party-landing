import { services } from '../../data/siteContent';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './ServicesSection.module.css';

export function ServicesSection() {
  return (
    <section id="services" className="site-section" data-testid="section-services" aria-labelledby="services-title">
      <div className="site-container">
        <div className={styles.frame}>
          <SectionHeading
            eyebrow="Что мы делаем"
            title={<span id="services-title">Услуги</span>}
            description="Четыре выразительных формата для сладкого, подвижного и фотогеничного праздника без перегруженной сцены."
          />

          <div className={styles.strip} data-testid="services-strip" data-scroll-snap="x">
            {services.map((service) => (
              <article key={service.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <img src={service.image} alt={service.name} className={styles.image} loading="lazy" />
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
