import { homePageContent } from '../../data/catalogContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './AboutSection.module.css';

export function AboutSection() {
  const { ref, revealState } = useScrollReveal();

  return (
    <section id="about" className="site-section" data-testid="section-about" data-section-tone="rose" aria-labelledby="about-title">
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={styles.sectionBody}>
          <SectionHeading title={<span id="about-title">О нас</span>} description={homePageContent.about.description} />

          <div className={styles.layout} data-testid="about-layout" data-about-layout="editorial-ladder">
            <div className={styles.copy}>
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
