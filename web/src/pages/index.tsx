import App from '../App';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { getHomeStructuredData } from '../config/seo';

export default function IndexPage() {
  return (
    <>
      <SEO
        title="Party Everyday — кейтеринг для праздников в Москве"
        description="Фудтраки, сладкая вата и шоколадный фонтан для частных, детских и корпоративных событий в Москве и области. Связь в Telegram, WhatsApp и отзывы на Avito."
        canonical="/"
      />
      <StructuredData data={getHomeStructuredData()} />
      <App />
    </>
  );
}
