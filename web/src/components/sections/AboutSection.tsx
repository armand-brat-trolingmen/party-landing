import { aboutAccents, aboutAtelierLayers, aboutAtelierScene } from '../../data/siteContent';
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
            eyebrow={aboutAtelierScene.eyebrow}
            title={<span id="about-title">О нас</span>}
            description={aboutAtelierScene.description}
          />

          <div className={`${styles.atelier} reveal-grid`} data-testid="about-atmosphere-stage" data-about-layout="atelier">
            <div className={styles.manifest} data-testid="about-brand-manifest">
              <span className={styles.manifestBadge}>Party Everyday</span>
              <p className={styles.manifestText}>{aboutAtelierScene.manifest}</p>
            </div>

            <div className={styles.stage}>
              <div className={styles.stageGlow} aria-hidden="true" />

              {aboutAtelierLayers.map((layer) => (
                <article
                  key={layer.id}
                  className={styles.layerCard}
                  data-layer-tone={layer.id}
                >
                  <span className={styles.layerLabel}>{layer.label}</span>
                  <p className={styles.layerDescription}>{layer.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className={`${styles.accentGrid} reveal-grid`}>
            {aboutAccents.map((accent) => (
              <article key={accent.id} className={styles.accentCard} data-testid="about-accent">
                <h3 className={styles.accentTitle}>{accent.title}</h3>
                <p className={styles.accentText}>{accent.text}</p>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
