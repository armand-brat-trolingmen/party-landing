import { useParams } from 'react-router';
import { SiteShell } from '../components/layout/SiteShell';
import { ArticlePageTemplate } from '../components/pages/ArticlePageTemplate';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { findArticleBySlug } from '../content/articles';
import { getArticleStructuredData } from '../config/seo';
import NotFoundPage from './404';

export default function ArticlePage() {
  const { slug } = useParams();
  const article = slug ? findArticleBySlug(slug) : undefined;

  if (!article) {
    return <NotFoundPage />;
  }

  return (
    <>
      <SEO
        title={article.title}
        description={article.description}
        canonical={`/articles/${article.slug}`}
        image={article.heroImage.src}
        imageAlt={article.heroImage.alt}
        type="article"
      />
      <StructuredData data={getArticleStructuredData(article)} />
      <SiteShell>
        <ArticlePageTemplate article={article} />
      </SiteShell>
    </>
  );
}
