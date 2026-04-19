import { Link } from 'react-router';
import {
  articles,
  findArticleBySlug,
  getArticlePath,
  type ArticleEntity,
  type ArticleTextBlock,
} from '../../content/articles';
import { getOfferingPath, services, type OfferingEntity } from '../../content/offerings';
import { useOrderModal } from '../cta/useOrderModal';
import styles from './ArticlePageTemplate.module.css';

type ArticlePageTemplateProps = {
  article: ArticleEntity;
};

function isOfferingEntity(value: OfferingEntity | undefined): value is OfferingEntity {
  return Boolean(value);
}

function isArticleEntity(value: ArticleEntity | undefined): value is ArticleEntity {
  return Boolean(value);
}

function ArticleBlock({ block }: { block: ArticleTextBlock }) {
  if (block.kind === 'paragraph') {
    return <p>{block.text}</p>;
  }

  const ListTag = block.style === 'ordered' ? 'ol' : 'ul';

  return (
    <ListTag>
      {block.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ListTag>
  );
}

function getRelatedServices(article: ArticleEntity) {
  return article.relatedServiceSlugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter(isOfferingEntity);
}

function getRelatedArticles(article: ArticleEntity) {
  return article.relatedArticleSlugs
    .map(findArticleBySlug)
    .filter(isArticleEntity)
    .filter((relatedArticle) => relatedArticle.slug !== article.slug);
}

export function ArticlePageTemplate({ article }: ArticlePageTemplateProps) {
  const { openModal } = useOrderModal();
  const relatedServices = getRelatedServices(article);
  const relatedArticles = getRelatedArticles(article);

  return (
    <article className={styles.page} data-testid="article-page">
      <section className={styles.hero} aria-labelledby="article-title">
        <div className={`site-container ${styles.heroGrid}`}>
          <div className={styles.copy}>
            <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
              <Link to="/">Главная</Link>
              <Link to="/articles/">Статьи</Link>
              <span aria-current="page">{article.h1}</span>
            </nav>

            <h1 id="article-title" className={styles.title}>
              {article.h1}
            </h1>
            <p className={styles.lead}>{article.lead}</p>
          </div>

          <div className={styles.heroMedia}>
            <picture>
              <source type="image/webp" srcSet={article.heroImage.src} />
              <img
                className={styles.heroImage}
                data-testid="article-hero-image"
                src={article.heroImage.fallbackSrc}
                alt={article.heroImage.alt}
                width={article.heroImage.width}
                height={article.heroImage.height}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                style={{ objectPosition: article.heroImage.objectPosition }}
              />
            </picture>
          </div>
        </div>
      </section>

      <div className={`site-container ${styles.bodyLayout}`}>
        <div className={styles.content}>
          {article.sections.map((section) => (
            <section key={section.id} className={styles.contentSection} aria-labelledby={`article-section-${section.id}`}>
              <h2 id={`article-section-${section.id}`}>{section.title}</h2>
              {section.blocks.map((block, index) => (
                <ArticleBlock key={`${section.id}-${index}`} block={block} />
              ))}
            </section>
          ))}
        </div>

        <aside className={styles.sidebar} aria-label="Навигация по статье">
          <div className={styles.sidebarCard}>
            <h2>В статье</h2>
            <ul>
              {article.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#article-section-${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <section className={styles.relatedSection} data-testid="article-related-services" aria-labelledby="article-services-title">
        <div className="site-container">
          <div className={styles.blockHeader}>
            <h2 id="article-services-title">Связанные услуги</h2>
            <p>Эти форматы можно использовать как основу или как часть общей фуд-зоны на мероприятии.</p>
          </div>
          <div className={styles.relatedGrid}>
            {relatedServices.map((service) => (
              <Link key={service.slug} className={styles.relatedCard} to={getOfferingPath(service)}>
                <span>{service.name}</span>
                <small>{service.shortDescription}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.faqSection} data-testid="article-faq" aria-labelledby="article-faq-title">
        <div className="site-container">
          <div className={styles.blockHeader}>
            <h2 id="article-faq-title">Частые вопросы</h2>
          </div>
          <div className={styles.faqGrid}>
            {article.faq.map((item) => (
              <details key={item.question} className={styles.faqItem}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection} data-testid="article-cta" aria-labelledby="article-cta-title">
        <div className="site-container">
          <div className={styles.ctaCard}>
            <div>
              <h2 id="article-cta-title">Нужно подобрать формат под вашу площадку?</h2>
              <p>Оставьте заявку через существующую форму, и мы уточним дату, гостей, площадку и подходящие станции.</p>
            </div>
            <button type="button" className={styles.ctaButton} onClick={openModal}>
              Подобрать формат
            </button>
          </div>
        </div>
      </section>

      <section className={styles.relatedSection} data-testid="article-related-articles" aria-labelledby="article-related-title">
        <div className="site-container">
          <div className={styles.blockHeader}>
            <h2 id="article-related-title">Ещё по теме</h2>
          </div>
          <div className={styles.relatedGrid} data-related-count={relatedArticles.length}>
            {relatedArticles.map((relatedArticle) => (
              <Link key={relatedArticle.slug} className={styles.relatedCard} to={`${getArticlePath(relatedArticle)}/`}>
                <span>{relatedArticle.h1}</span>
                <small>{relatedArticle.description}</small>
              </Link>
            ))}
            {relatedArticles.length === 0
              ? articles
                  .filter((relatedArticle) => relatedArticle.slug !== article.slug)
                  .slice(0, 2)
                  .map((relatedArticle) => (
                    <Link key={relatedArticle.slug} className={styles.relatedCard} to={`${getArticlePath(relatedArticle)}/`}>
                      <span>{relatedArticle.h1}</span>
                      <small>{relatedArticle.description}</small>
                    </Link>
                  ))
              : null}
          </div>
        </div>
      </section>
    </article>
  );
}
