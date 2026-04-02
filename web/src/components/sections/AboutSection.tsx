import { aboutPoints } from '../../data/siteContent';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './AboutSection.module.css';

export function AboutSection() {
  return (
    <section className="site-section" data-testid="section-about" aria-labelledby="about-title">
      <div className="site-container">
        <article id="about" className={`${styles.frame} site-anchor`}>
          <SectionHeading
            eyebrow="Кто мы"
            title={<span id="about-title">О нас</span>}
            description="Создаём атмосферу sweet-editorial праздника: вкусно, аккуратно и визуально цельно."
          />
          <ul className={styles.points}>
            {aboutPoints.map((point) => (
              <li key={point} className={styles.point}>
                {point}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
