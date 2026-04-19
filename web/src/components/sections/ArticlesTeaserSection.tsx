import { Link } from 'react-router';
import styles from './ArticlesTeaserSection.module.css';

export function ArticlesTeaserSection() {
  return (
    <section className={styles.section} data-testid="section-articles-teaser" aria-labelledby="articles-teaser-title">
      <div className="site-container">
        <article className={styles.card}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Гид по форматам</p>
            <h2 id="articles-teaser-title" className={styles.title}>
              Не уверены, какой формат выбрать?
            </h2>
            <p className={styles.description}>
              Посмотрите статьи по фуд-станциям и выездному кейтерингу: что подходит для детей, корпоратива, welcome-зоны
              и открытой площадки.
            </p>
          </div>
          <Link className={styles.link} to="/articles/">
            Читать статьи <span aria-hidden="true">→</span>
          </Link>
        </article>
      </div>
    </section>
  );
}
