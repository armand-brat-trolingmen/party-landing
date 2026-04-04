import App from '../App';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { getHomeStructuredData } from '../config/seo';

export default function IndexPage() {
  return (
    <>
      <SEO
        title="Party Time — фудтраки, сладкая вата и шоколадный фонтан в Москве"
        description="Party Time — кейтеринг и сладкие зоны для частных, детских и корпоративных событий в Москве и Московской области. Фудтраки, сладкая вата, шоколадный фонтан и быстрый контакт в Telegram, WhatsApp и Avito."
        canonical="/"
      />
      <StructuredData data={getHomeStructuredData()} />
      <App />
    </>
  );
}
