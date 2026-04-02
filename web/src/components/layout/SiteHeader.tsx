import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { navItems, siteContent } from '../../data/siteContent';
import { DonutLogo } from '../branding/DonutLogo';
import styles from './SiteHeader.module.css';

function getDocumentTop(element: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = element;

  while (node) {
    top += node.offsetTop;
    node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
  }

  return top;
}

export function SiteHeader() {
  const headerRef = useRef<HTMLElement | null>(null);
  const panelId = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia?.('(min-width: 721px)').matches ?? true);

  const getSectionScrollTop = useCallback((target: HTMLElement) => {
    const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0;
    const viewportHeight = window.innerHeight;
    const anchorTarget = target.querySelector<HTMLElement>(':scope > .site-container') ?? target;
    const visualGap = window.innerWidth <= 720 ? 20 : 24;
    const nextTop = getDocumentTop(anchorTarget) - headerHeight - visualGap;
    const maxTop = Math.max(0, document.documentElement.scrollHeight - viewportHeight);

    return Math.min(Math.max(0, nextTop), maxTop);
  }, []);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
    const top = getSectionScrollTop(target);

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => window.scrollTo({ top, behavior }));
      return;
    }

    window.setTimeout(() => window.scrollTo({ top, behavior }), 0);
  };

  const onAnchorClick = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    if (!isDesktop) setIsMenuOpen(false);

    if (window.history?.pushState) {
      window.history.pushState(null, '', `#${id}`);
    } else {
      window.location.hash = id;
    }

    scrollToSection(id);
  };

  useEffect(() => {
    if (!window.matchMedia) return;

    const query = window.matchMedia('(min-width: 721px)');
    const sync = () => {
      setIsDesktop(query.matches);
      if (query.matches) {
        setIsMenuOpen(false);
      }
    };

    if (query.addEventListener) {
      query.addEventListener('change', sync);
      return () => query.removeEventListener('change', sync);
    }

    query.addListener(sync);
    return () => query.removeListener(sync);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const root = document.documentElement;

    const sync = () => {
      const height = header.getBoundingClientRect().height;
      if (!Number.isFinite(height) || height <= 0) return;
      root.style.setProperty('--header-offset', `${Math.ceil(height)}px`);
    };

    sync();

    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(sync);
      resizeObserver.observe(header);
    }

    window.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('resize', sync);
      resizeObserver?.disconnect();
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.replace('#', '');
    const target = document.getElementById(id);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
    const top = getSectionScrollTop(target);

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => window.scrollTo({ top, behavior }));
      return;
    }

    window.setTimeout(() => window.scrollTo({ top, behavior }), 0);
  }, [getSectionScrollTop]);

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#hero" onClick={onAnchorClick('hero')}>
          <span className={styles.brandInner}>
            <DonutLogo className={styles.logoMark} size={44} />
            <span>{siteContent.brand}</span>
          </span>
        </a>
        <p className={styles.tagline}>{siteContent.tagline}</p>
        {isDesktop ? (
          <nav aria-label="Основная навигация" className={styles.nav}>
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.id}>
                  <a className={styles.navLink} href={`#${item.id}`} onClick={onAnchorClick(item.id)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : (
          <div className={styles.mobile}>
            <button
              type="button"
              className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonOpen : ''}`}
              aria-label="Меню"
              aria-expanded={isMenuOpen}
              aria-controls={panelId}
              data-menu-open={isMenuOpen ? 'true' : 'false'}
              data-testid="menu-button"
              onClick={() => setIsMenuOpen((value) => !value)}
            >
              <span className={styles.menuButtonGlyph} aria-hidden="true">
                <span
                  className={`${styles.menuButtonLine} ${styles.menuButtonLineTop}`}
                  data-menu-line="true"
                  data-testid="menu-button-line-top"
                />
                <span
                  className={`${styles.menuButtonLine} ${styles.menuButtonLineMiddle}`}
                  data-menu-line="true"
                  data-testid="menu-button-line-middle"
                />
                <span
                  className={`${styles.menuButtonLine} ${styles.menuButtonLineBottom}`}
                  data-menu-line="true"
                  data-testid="menu-button-line-bottom"
                />
              </span>
            </button>
            {isMenuOpen ? (
              <>
                <button
                  type="button"
                  className={styles.backdrop}
                  aria-label="Закрыть меню"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div id={panelId} className={styles.mobilePanel}>
                  <nav aria-label="Основная навигация" className={styles.mobileNav}>
                    <ul className={styles.mobileNavList}>
                      {navItems.map((item) => (
                        <li key={item.id}>
                          <a
                            className={styles.mobileNavLink}
                            href={`#${item.id}`}
                            onClick={onAnchorClick(item.id)}
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
}
