import { navItems, siteContent } from '../../data/siteContent';
import { DonutLogo } from '../branding/DonutLogo';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#hero">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
            <DonutLogo />
            <span>{siteContent.brand}</span>
          </span>
        </a>
        <p className={styles.tagline}>{siteContent.tagline}</p>
        <nav aria-label="Основная навигация" className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a className={styles.navLink} href={`#${item.id}`}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
