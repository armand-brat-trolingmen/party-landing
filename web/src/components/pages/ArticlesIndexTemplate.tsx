import { Link } from 'react-router';
import { getArticlePath, type ArticleEntity } from '../../content/articles';
import styles from './ArticlesIndexTemplate.module.css';

type ArticlesIndexTemplateProps = {
  articles: readonly ArticleEntity[];
};

function getArticleHref(article: ArticleEntity) {
  return `${getArticlePath(article)}/`;
}

export function ArticlesIndexTemplate({ articles }: ArticlesIndexTemplateProps) {
  return (
    <section className={styles.section} aria-labelledby="articles-title" data-testid="articles-index">
      <div className="site-container">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Статьи</p>
          <h1 id="articles-title" className={styles.title}>
            Статьи
          </h1>
          <p className={styles.description}>
            Практические материалы о фуд-станциях, сладких зонах, фудтраках и выездных форматах для мероприятий в
            Москве и Московской области.
          </p>
        </header>

        <div className={styles.grid}>
          {articles.map((article) => (
            <article key={article.slug} className={styles.card}>
              <Link className={styles.link} to={getArticleHref(article)}>
                <picture className={styles.media}>
                  <source type="image/webp" srcSet={article.heroImage.src} />
                  <img
                    className={styles.image}
                    src={article.heroImage.fallbackSrc}
                    alt={article.heroImage.alt}
                    width={article.heroImage.width}
                    height={article.heroImage.height}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: article.heroImage.objectPosition }}
                  />
                </picture>
                <span className={styles.body}>
                  <h2 className={styles.cardTitle}>{article.h1}</h2>
                  <span className={styles.cardDescription}>{article.description}</span>
                  <span className={styles.readMore}>Читать статью</span>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
