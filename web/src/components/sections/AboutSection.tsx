import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../../content';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './AboutSection.module.css';

const COUNT_ANIMATION_DURATION_MS = 2750;

type CounterParts = {
  target: number;
  prefix: string;
  suffix: string;
};

function parseCounterValue(value: string): CounterParts | null {
  const match = value.match(/^(\D*?)(\d+)(.*)$/);

  if (!match) {
    return null;
  }

  return {
    prefix: match[1],
    target: Number.parseInt(match[2], 10),
    suffix: match[3],
  };
}

function easeOutQuart(progress: number) {
  return 1 - Math.pow(1 - progress, 4);
}

function formatCounterValue(parts: CounterParts, value: number) {
  return `${parts.prefix}${Math.round(value)}${parts.suffix}`;
}

type AnimatedFactValueProps = {
  value: string;
};

function AnimatedFactValue({ value }: AnimatedFactValueProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const parts = parseCounterValue(value);
    const node = ref.current;

    if (!parts || !node || hasAnimatedRef.current) {
      return;
    }

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (prefersReducedMotion || typeof window.IntersectionObserver === 'undefined') {
      return;
    }

    let frameId = 0;
    let startTime = 0;

    const runAnimation = (time: number) => {
      if (startTime === 0) {
        startTime = time;
      }

      const progress = Math.min((time - startTime) / COUNT_ANIMATION_DURATION_MS, 1);
      const easedProgress = easeOutQuart(progress);

      setDisplayValue(formatCounterValue(parts, parts.target * easedProgress));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(runAnimation);
      } else {
        setDisplayValue(value);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.intersectionRatio < 0.35) {
          return;
        }

        hasAnimatedRef.current = true;
        setDisplayValue(formatCounterValue(parts, 0));
        frameId = window.requestAnimationFrame(runAnimation);
        observer.disconnect();
      },
      { threshold: 0.35, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [value]);

  return (
    <span ref={ref} className={styles.factValue} aria-label={value}>
      {displayValue}
    </span>
  );
}

export function AboutSection() {
  const { ref, revealState } = useScrollReveal();
  const { about } = siteConfig.homepage;

  return (
    <section id="about" className="site-section" data-testid="section-about" aria-labelledby="about-title">
      <div ref={ref} className="site-container site-reveal" data-reveal-state={revealState} data-reveal-stagger="true">
        <div className={styles.sectionBody}>
          <SectionHeading title={<span id="about-title">{about.title}</span>} />

          <div className={styles.layout} data-testid="about-layout" data-about-layout="manifest-band">
            <div className={styles.copy}>
              <div className={styles.manifest} data-testid="about-manifest">
                {about.manifestParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className={`${styles.proofStrip} reveal-grid`} data-testid="about-proof-strip">
              {about.facts.map((fact) => (
                <article key={fact.id} className={styles.factCard} data-testid="about-fact">
                  <AnimatedFactValue value={fact.value} />
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
