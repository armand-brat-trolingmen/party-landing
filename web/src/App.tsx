import { lazy, Suspense } from 'react';
import { SiteShell } from './components/layout/SiteShell';
import { AboutSection } from './components/sections/AboutSection';
import { ConceptLoopSection } from './components/sections/ConceptLoopSection';
import { ExtrasSection } from './components/sections/ExtrasSection';
import { FaqSection } from './components/sections/FaqSection';
import { HeroSection } from './components/sections/HeroSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { siteConfig } from './content';
import './styles/global.css';

const LazyFoodTruckRentalSection = lazy(async () => ({
  default: (await import('./components/sections/FoodTruckRentalSection')).FoodTruckRentalSection,
}));
const LazyFoodTrucksSection = lazy(async () => ({
  default: (await import('./components/sections/FoodTrucksSection')).FoodTrucksSection,
}));
const LazyTestimonialsSection = lazy(async () => ({
  default: (await import('./components/sections/TestimonialsSection')).TestimonialsSection,
}));
const LazyContactPlaceholderSection = lazy(async () => ({
  default: (await import('./components/sections/ContactPlaceholderSection')).ContactPlaceholderSection,
}));
const LazyCtaSection = lazy(async () => ({
  default: (await import('./components/sections/CtaSection')).CtaSection,
}));

type LazySectionFallbackProps = {
  id: string;
  testId: string;
  title: string;
  label: string;
};

function LazySectionFallback({ id, testId, title, label }: LazySectionFallbackProps) {
  return (
    <section
      id={id}
      className="site-section lazy-section-fallback"
      data-testid={testId}
      aria-labelledby={`${testId}-title`}
      aria-label={label}
      aria-busy="true"
    >
      <div className="site-container">
        <header className="site-section__header">
          <h2 id={`${testId}-title`}>{title}</h2>
        </header>
        <div className="lazy-section-skeleton" />
      </div>
    </section>
  );
}

export default function App() {
  return (
    <SiteShell motionPath="canvas-flow">
      <HeroSection />
      <ConceptLoopSection />
      <AboutSection />
      <ServicesSection />
      <ExtrasSection />
      <Suspense
        fallback={
          <LazySectionFallback
            id="food-truck-rental"
            testId="section-food-truck-rental"
            title={siteConfig.homepage.foodTruckRental.title}
            label="Загрузка блока аренды фудтраков"
          />
        }
      >
        <LazyFoodTruckRentalSection />
      </Suspense>
      <Suspense
        fallback={
          <LazySectionFallback
            id="food-trucks"
            testId="section-food-trucks"
            title={siteConfig.homepage.foodTrucks.title}
            label="Загрузка блока кейтеринга на фудтраках"
          />
        }
      >
        <LazyFoodTrucksSection />
      </Suspense>
      <Suspense
        fallback={
          <LazySectionFallback
            id="testimonials"
            testId="section-testimonials"
            title={siteConfig.homepage.reviews.title}
            label="Загрузка отзывов"
          />
        }
      >
        <LazyTestimonialsSection />
      </Suspense>
      <FaqSection />
      <Suspense
        fallback={
          <LazySectionFallback
            id="contact"
            testId="section-contact"
            title={siteConfig.homepage.contact.title}
            label="Загрузка контактов"
          />
        }
      >
        <LazyContactPlaceholderSection />
      </Suspense>
      <Suspense
        fallback={
          <LazySectionFallback
            id="cta"
            testId="section-cta"
            title={siteConfig.homepage.cta.title}
            label="Загрузка финального блока заказа"
          />
        }
      >
        <LazyCtaSection />
      </Suspense>
    </SiteShell>
  );
}
