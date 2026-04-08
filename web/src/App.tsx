import { SiteShell } from './components/layout/SiteShell';
import { AboutSection } from './components/sections/AboutSection';
import { ContactPlaceholderSection } from './components/sections/ContactPlaceholderSection';
import { CtaSection } from './components/sections/CtaSection';
import { ExtrasSection } from './components/sections/ExtrasSection';
import { FaqSection } from './components/sections/FaqSection';
import { HeroSection } from './components/sections/HeroSection';
import { ReviewsSection } from './components/sections/ReviewsSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import './styles/global.css';

export default function App() {
  return (
    <SiteShell motionPath="story-trail">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ExtrasSection />
      <CtaSection />
      <ReviewsSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactPlaceholderSection />
    </SiteShell>
  );
}
