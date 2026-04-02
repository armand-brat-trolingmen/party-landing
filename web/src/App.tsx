import { SiteHeader } from './components/layout/SiteHeader';
import { AboutSection } from './components/sections/AboutSection';
import { ContactPlaceholderSection } from './components/sections/ContactPlaceholderSection';
import { FaqSection } from './components/sections/FaqSection';
import { HeroSection } from './components/sections/HeroSection';
import { ReviewsSection } from './components/sections/ReviewsSection';
import { ServicesSection } from './components/sections/ServicesSection';
import './styles/global.css';

export default function App() {
  return (
    <>
      <SiteHeader />
      <main className="site-shell" data-motion-path="glow-trail">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ReviewsSection />
        <FaqSection />
        <ContactPlaceholderSection />
      </main>
    </>
  );
}
