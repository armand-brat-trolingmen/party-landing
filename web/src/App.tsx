import { SiteHeader } from './components/layout/SiteHeader';
import { AboutSection } from './components/sections/AboutSection';
import { HeroSection } from './components/sections/HeroSection';
import { ReviewsSection } from './components/sections/ReviewsSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { SectionHeading } from './components/ui/SectionHeading';
import './styles/global.css';

const shellSections = [
  {
    id: 'faq',
    title: 'Частые вопросы',
    eyebrow: 'Полезно знать',
    description: 'Добавим ответы про формат работы, бронирование, логистику и подготовку площадки.',
  },
  {
    id: 'contact',
    title: 'Контакты',
    eyebrow: 'Связаться с нами',
    description: 'В этом разделе появятся способы связи, чтобы быстро обсудить дату, формат и детали события.',
  },
] as const;

export default function App() {
  return (
    <>
      <SiteHeader />
      <main className="site-shell">
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <ReviewsSection />
        {shellSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="site-section"
            data-testid={`section-${section.id}`}
            aria-label={section.title}
          >
            <div className="site-container">
              <article className="site-section__content">
                <SectionHeading
                  eyebrow={section.eyebrow}
                  title={section.title}
                  description={section.description}
                />
              </article>
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
