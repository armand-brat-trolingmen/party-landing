import { aboutStories } from '../../data/siteContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './AboutSection.module.css';

export function AboutSection() {
  const { ref, revealState } = useScrollReveal();

  return (
    <section id="about" className="site-section" data-testid="section-about" aria-labelledby="about-title">
      <div
        ref={ref}
        className="site-container site-reveal"
        data-reveal-state={revealState}
        data-reveal-stagger="true"
      >
        <article className={`${styles.frame} site-panel-glow`}>
          <SectionHeading
            eyebrow="Кто мы"
            title={<span id="about-title">О нас</span>}
            description="Создаём атмосферу sweet-editorial праздника: вкусно, аккуратно и визуально цельно."
          />
          <div className={`${styles.grid} reveal-grid`}>
            {aboutStories.map((story) => (
              <article key={story.id} className={styles.storyCard}>
                <div className={styles.illustrationWrap}>
                  <img
                    src={story.image}
                    alt={story.alt}
                    className={styles.illustration}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className={styles.storyText}>{story.text}</p>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
