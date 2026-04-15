import { Helmet } from 'react-helmet-async';
import App from '../App';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { siteConfig } from '../content';
import { getHomeStructuredData } from '../config/seo';

export default function IndexPage() {
  const heroPreload = siteConfig.homepage.hero.slides[0];
  const heroPreloadSrc = heroPreload.imageWebpSrcSet?.split(',')[0]?.trim().split(/\s+/)[0] ?? heroPreload.image;

  return (
    <>
      <SEO
        title="Праздник каждый день — кейтеринг для праздников в Москве"
        description="Фудтраки, сладкая вата и шоколадный фонтан для частных, детских и корпоративных событий в Москве и области. Связь в Telegram, WhatsApp и отзывы на Avito."
        canonical="/"
      />
      <Helmet prioritizeSeoTags>
        <link
          rel="preload"
          as="image"
          href={heroPreloadSrc}
          imageSrcSet={heroPreload.imageWebpSrcSet}
          imageSizes={heroPreload.sizes}
          fetchPriority="high"
          type="image/webp"
        />
      </Helmet>
      <StructuredData data={getHomeStructuredData()} />
      <App />
    </>
  );
}
