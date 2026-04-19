import { Link } from 'react-router';
import {
  articles,
  findArticleBySlug,
  getArticlePath,
  type ArticleEntity,
  type ArticleIconId,
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

function ArticleIcon({ icon }: { icon: ArticleIconId }) {
  const pathByIcon: Record<ArticleIconId, string> = {
    foodStation:
      'M5 18.2h14M6.2 10.4h11.6M7.3 10.4v7.8m9.4-7.8v7.8M8 7.2h8l1.8 3.2H6.2L8 7.2Zm2.1 0V5.8c0-.9.7-1.6 1.6-1.6h.6c.9 0 1.6.7 1.6 1.6v1.4',
    sweetStation:
      'M12 4.4c2.5 0 4.4 1.5 4.4 3.4 0 1.7-1.4 3-3.3 3.3l-.6 7.1h-1l-.6-7.1c-1.9-.3-3.3-1.6-3.3-3.3 0-1.9 1.9-3.4 4.4-3.4Zm-4.1 9.2h8.2l1.2 4.6H6.7l1.2-4.6Z',
    foodTruck:
      'M4.8 14.6V7.2h9.4v7.4M14.2 10.1h2.8l2.2 2.8v1.7h-5M6.6 16.7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10.7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM4.8 14.6h.3m3 0h7.7',
  };

  return (
    <span className={styles.serviceIcon} data-testid="article-service-icon" data-article-icon={icon} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d={pathByIcon[icon]} />
      </svg>
    </span>
  );
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

            <div className={styles.headingRow}>
              <ArticleIcon icon={article.serviceIcon} />
              <p className={styles.eyebrow}>Полезный материал</p>
            </div>

            <h1 id="article-title" className={styles.title}>
              {article.h1}
            </h1>
            <p className={styles.lead}>{article.lead}</p>
          </div>

          <div className={styles.heroMedia}>
            <img
              className={styles.heroImage}
              data-testid="article-hero-image"
              src={article.heroImage.src}
              alt={article.heroImage.alt}
              width={article.heroImage.width}
              height={article.heroImage.height}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              style={{ objectPosition: article.heroImage.objectPosition }}
            />
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
