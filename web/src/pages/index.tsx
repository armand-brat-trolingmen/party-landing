import { Helmet } from 'react-helmet-async';
import App from '../App';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { getHomeStructuredData } from '../config/seo';
import { heroPosterSlides } from '../data/siteContent';

export default function IndexPage() {
  const heroPreload = heroPosterSlides[0];

  return (
    <>
      <SEO
        title="Праздник каждый день — кейтеринг для праздников в Москве"
        description="Фудтраки, сладкая вата и шоколадный фонтан для частных, детских и корпоративных событий в Москве и области. Связь в Telegram, WhatsApp и отзывы на Avito."
        canonical="/"
      />
      <Helmet prioritizeSeoTags>
        <link rel="preload" as="image" href={heroPreload.fallbackImage ?? heroPreload.image} />
      </Helmet>
      <StructuredData data={getHomeStructuredData()} />
      <App />
    </>
  );
}
