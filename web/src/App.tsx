import { SiteHeader } from './components/layout/SiteHeader';
import { siteContent } from './data/siteContent';
import './styles/global.css';

export default function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <section id="hero" data-testid="section-hero" aria-label="Главный экран">
          <h1>{siteContent.brand}</h1>
          <p>{siteContent.tagline}</p>
          <p>{siteContent.heroDescription}</p>
        </section>
        <section id="services" data-testid="section-services" aria-label="Услуги" />
        <section id="about" data-testid="section-about" aria-label="О нас" />
        <section id="gallery" data-testid="section-gallery" aria-label="Галерея" />
        <section id="reviews" data-testid="section-reviews" aria-label="Отзывы" />
        <section id="faq" data-testid="section-faq" aria-label="Частые вопросы" />
        <section id="contact" data-testid="section-contact" aria-label="Контакты" />
      </main>
    </>
  );
}
