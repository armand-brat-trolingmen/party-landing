import { homePageContent } from '../../data/catalogContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useOrderModal } from '../cta/useOrderModal';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const { ref, revealState } = useScrollReveal({ rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  const { openModal } = useOrderModal();
  const heroTitleLines = ['Фуд-станции', 'на ваше', 'мероприятие'] as const;

  const scrollToServices = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const target = document.getElementById('services');
    if (!target) {
      return;
    }

    const behavior = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    target.scrollIntoView({ behavior, block: 'start' });
  };

  return (
    <section id="hero" className={styles.hero} data-testid="section-hero" data-hero-style="clean-canvas" aria-label="Главный экран">
      <div
        ref={ref}
        className={`site-container ${styles.container} site-reveal`}
        data-reveal-state={revealState}
        data-reveal-stagger="true"
      >
        <div className={styles.copyColumn}>
          <h1 className={styles.tagline} aria-label={homePageContent.hero.title}>
            {heroTitleLines.map((line, index) => (
              <span key={line} className={styles.taglineLine} data-testid={`hero-title-line-${index + 1}`}>
                {line}
              </span>
            ))}
          </h1>

          <div className={styles.actions}>
            <button type="button" className={styles.primaryAction} onClick={openModal}>
              {homePageContent.hero.primaryActionLabel}
            </button>
            <button type="button" className={styles.secondaryAction} onClick={scrollToServices}>
              {homePageContent.hero.secondaryActionLabel}
            </button>
          </div>
        </div>

        <div className={styles.visualField} aria-hidden="true">
          <div className={styles.visualGlow} />
          <div className={styles.visualGlowSecondary} />
        </div>
      </div>
    </section>
  );
}
