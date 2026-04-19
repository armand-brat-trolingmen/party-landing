import { SiteShell } from './components/layout/SiteShell';
import { AboutSection } from './components/sections/AboutSection';
import { ArticlesTeaserSection } from './components/sections/ArticlesTeaserSection';
import { ConceptLoopSection } from './components/sections/ConceptLoopSection';
import { ContactPlaceholderSection } from './components/sections/ContactPlaceholderSection';
import { CtaSection } from './components/sections/CtaSection';
import { ExtrasSection } from './components/sections/ExtrasSection';
import { FaqSection } from './components/sections/FaqSection';
import { FoodTruckRentalSection } from './components/sections/FoodTruckRentalSection';
import { FoodTrucksSection } from './components/sections/FoodTrucksSection';
import { HeroSection } from './components/sections/HeroSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import './styles/global.css';

export default function App() {
  return (
    <SiteShell motionPath="canvas-flow">
      <HeroSection />
      <ConceptLoopSection />
      <AboutSection />
      <ServicesSection />
      <ArticlesTeaserSection />
      <ExtrasSection />
      <FoodTruckRentalSection />
      <FoodTrucksSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactPlaceholderSection />
      <CtaSection />
    </SiteShell>
  );
}
