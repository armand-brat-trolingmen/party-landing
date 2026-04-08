import { homePageContent } from '../../data/catalogContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './AboutSection.module.css';

export function AboutSection() {
  const { ref, revealState } = useScrollReveal();

  return (
    <section id="about" className="site-section" data-testid="section-about" aria-labelledby="about-title">
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={`${styles.frame} site-panel-glow`} data-section-surface="canvas" data-section-tone="rose">
          <div className={styles.layout} data-testid="about-layout" data-about-layout="manifest-strip">
            <div className={styles.copy}>
              <h2 id="about-title" className={styles.title}>
                О нас
              </h2>
              <p className={styles.description}>{homePageContent.about.description}</p>
              <p className={styles.manifest} data-testid="about-manifest">
                {homePageContent.about.manifest}
              </p>
            </div>

            <div className={`${styles.factGrid} reveal-grid`} data-testid="about-facts">
              {homePageContent.about.facts.map((fact) => (
                <article key={fact.id} className={styles.factCard} data-testid="about-fact">
                  <span className={styles.factValue}>{fact.value}</span>
                  <span className={styles.factLabel}>{fact.label}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
