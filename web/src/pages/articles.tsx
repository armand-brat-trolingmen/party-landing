import { ArticlesIndexTemplate } from '../components/pages/ArticlesIndexTemplate';
import { SEO } from '../components/SEO';
import { SiteShell } from '../components/layout/SiteShell';
import { articles } from '../content/articles';

const articlesTitle = 'Статьи о фуд-станциях и кейтеринге | Праздник каждый день';
const articlesDescription =
  'Статьи о фуд-станциях, сладких зонах, фудтраках и выездном кейтеринге для мероприятий в Москве и области.';

export default function ArticlesPage() {
  return (
    <>
      <SEO title={articlesTitle} description={articlesDescription} canonical="/articles" />
      <SiteShell>
        <ArticlesIndexTemplate articles={articles} />
      </SiteShell>
    </>
  );
}
