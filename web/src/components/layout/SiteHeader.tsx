import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { navItems, siteContent } from '../../data/siteContent';
import { DonutLogo } from '../branding/DonutLogo';
import { useOrderModal } from '../cta/useOrderModal';
import styles from './SiteHeader.module.css';

type SiteHeaderProps = {
  legalMode?: boolean;
};

function getDocumentTop(element: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = element;

  while (node) {
    top += node.offsetTop;
    node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
  }

  return top;
}

const NAV_ARIA_LABEL = 'Основная навигация';
const MENU_ARIA_LABEL = 'Меню';
const CLOSE_MENU_ARIA_LABEL = 'Закрыть меню';

export function SiteHeader({ legalMode = false }: SiteHeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const navigationLockRef = useRef<{ id: string; unlockAt: number } | null>(null);
  const panelId = useId();
  const location = useLocation();
  const { openModal } = useOrderModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => (typeof window === 'undefined' ? true : window.matchMedia?.('(min-width: 721px)').matches ?? true),
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const isHomeRoute = location.pathname === '/';

  const getSectionScrollTop = useCallback((target: HTMLElement) => {
    const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0;
    const viewportHeight = window.innerHeight;
    const anchorTarget = target.querySelector<HTMLElement>(':scope > .site-container') ?? target;
    const visualGap = window.innerWidth <= 720 ? 20 : 24;
    const nextTop = getDocumentTop(anchorTarget) - headerHeight - visualGap;
    const maxTop = Math.max(0, document.documentElement.scrollHeight - viewportHeight);

    return Math.min(Math.max(0, nextTop), maxTop);
  }, []);

  const canScrollInCurrentPage = useCallback(
    (id: string) => {
      if (legalMode) {
        return false;
      }

      if (isHomeRoute) {
        return true;
      }

      return id !== 'about';
    },
    [isHomeRoute, legalMode],
  );

  const resolveNavHref = useCallback(
    (id: string) => {
      if (legalMode) {
        return `/#${id}`;
      }

      if (isHomeRoute) {
        return `#${id}`;
      }

      return id === 'about' ? '/#about' : `#${id}`;
    },
    [isHomeRoute, legalMode],
  );

  const scrollToSection = useCallback(
    (id: string) => {
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
    },
    [getSectionScrollTop],
  );

  const onAnchorClick = useCallback(
    (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      if (!canScrollInCurrentPage(id)) {
        if (!isDesktop) setIsMenuOpen(false);
        return;
      }

      event.preventDefault();

      if (!isDesktop) setIsMenuOpen(false);
      if (id !== 'hero') {
        setActiveSectionId(id);
        navigationLockRef.current = {
          id,
          unlockAt: window.performance.now() + 1400,
        };
      } else {
        navigationLockRef.current = null;
      }

      if (window.history?.pushState) {
        window.history.pushState(null, '', `#${id}`);
      } else {
        window.location.hash = id;
      }

      scrollToSection(id);
    },
    [canScrollInCurrentPage, isDesktop, scrollToSection],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsMenuOpen(false), 0);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!window.matchMedia) return;

    const query = window.matchMedia('(min-width: 721px)');
    const sync = () => {
      setIsDesktop(query.matches);
      if (query.matches) {
        setIsMenuOpen(false);
      }
    };

    sync();

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
    if (typeof window === 'undefined') return;

    let rafId = 0;

    const sync = () => {
      if (legalMode) {
        setActiveSectionId(null);
        setIsScrolled(window.scrollY > 18);
        rafId = 0;
        return;
      }

      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0;
      const probe = window.scrollY + headerHeight + window.innerHeight * 0.18;
      let nextActive: string | null = null;

      for (const item of navItems) {
        if (!canScrollInCurrentPage(item.id)) {
          continue;
        }

        const section = document.getElementById(item.id);
        if (section && getDocumentTop(section) <= probe) {
          nextActive = item.id;
        }
      }

      const navigationLock = navigationLockRef.current;

      if (navigationLock) {
        const target = document.getElementById(navigationLock.id);
        if (!target) {
          navigationLockRef.current = null;
        } else {
          const distanceToTarget = Math.abs(window.scrollY - getSectionScrollTop(target));
          const isExpired = window.performance.now() >= navigationLock.unlockAt;

          if (!isExpired && distanceToTarget > 22) {
            nextActive = navigationLock.id;
          } else {
            navigationLockRef.current = null;
            nextActive = navigationLock.id;
          }
        }
      }

      setActiveSectionId((current) => (current === nextActive ? current : nextActive));
      setIsScrolled(window.scrollY > 18);
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [canScrollInCurrentPage, getSectionScrollTop, legalMode]);

  useEffect(() => {
    if (!location.hash || legalMode) return;

    const id = location.hash.replace('#', '');
    if (!canScrollInCurrentPage(id)) {
      return;
    }

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
  }, [canScrollInCurrentPage, getSectionScrollTop, legalMode, location.hash, location.pathname]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const clearIndicator = () => {
      nav.dataset.indicatorVisible = 'false';
      nav.style.setProperty('--nav-indicator-width', '0px');
      nav.style.setProperty('--nav-indicator-x', '0px');
    };

    if (!isDesktop || legalMode) {
      clearIndicator();
      return;
    }

    const activeLink = activeSectionId ? linkRefs.current[activeSectionId] : null;

    const syncIndicator = () => {
      if (!activeLink) {
        clearIndicator();
        return;
      }

      const navBox = nav.getBoundingClientRect();
      const linkBox = activeLink.getBoundingClientRect();

      nav.style.setProperty('--nav-indicator-width', `${linkBox.width}px`);
      nav.style.setProperty('--nav-indicator-x', `${linkBox.left - navBox.left}px`);
      nav.dataset.indicatorVisible = 'true';
    };

    syncIndicator();

    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== 'undefined' && activeLink) {
      resizeObserver = new ResizeObserver(syncIndicator);
      resizeObserver.observe(nav);
      resizeObserver.observe(activeLink);
    }

    window.addEventListener('resize', syncIndicator);
    return () => {
      window.removeEventListener('resize', syncIndicator);
      resizeObserver?.disconnect();
    };
  }, [activeSectionId, isDesktop, legalMode]);

  const brandHref = !legalMode && isHomeRoute ? '#hero' : '/';

  return (
    <header
      className={styles.header}
      ref={headerRef}
      data-header-route={!legalMode && isHomeRoute ? 'home' : 'inner'}
      data-header-state={isScrolled ? 'compact' : 'rest'}
      data-header-material="glass"
      data-testid="site-header"
    >
      <div className={styles.inner}>
        <a
          className={styles.brand}
          href={brandHref}
          onClick={!legalMode && isHomeRoute ? onAnchorClick('hero') : undefined}
          aria-label={siteContent.brand}
        >
          <span className={styles.brandPlate} data-testid="brand-plate">
            <DonutLogo className={styles.logoMark} size={46} />
          </span>
          <span className={styles.brandText}>{siteContent.brand}</span>
        </a>

        {isDesktop ? (
          <div className={styles.desktopActions}>
            <nav aria-label={NAV_ARIA_LABEL} className={styles.nav} ref={navRef}>
              <span className={styles.navIndicator} data-testid="nav-active-indicator" aria-hidden="true" />
              <ul className={styles.navList}>
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      ref={(node) => {
                        linkRefs.current[item.id] = node;
                      }}
                      className={styles.navLink}
                      href={resolveNavHref(item.id)}
                      onClick={onAnchorClick(item.id)}
                      data-active={activeSectionId === item.id ? 'true' : 'false'}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {!legalMode ? (
              <button type="button" className={styles.headerCta} onClick={openModal} data-testid="header-order-button">
                <span className={styles.headerCtaInner}>
                  <span className={styles.headerCtaLabel}>Заказать</span>
                  <span className={styles.headerCtaArrow} data-testid="header-order-button-arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </button>
            ) : null}
          </div>
        ) : (
          <div className={styles.mobileActions}>
            {!legalMode ? (
              <button type="button" className={styles.mobileCta} onClick={openModal} data-testid="header-order-button">
                <span className={styles.mobileCtaInner}>
                  <span className={styles.mobileCtaLabel}>Заказать</span>
                  <span className={styles.mobileCtaArrow} aria-hidden="true">
                    →
                  </span>
                </span>
              </button>
            ) : null}
            <div className={styles.mobile}>
              <button
                type="button"
                className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonOpen : ''}`}
                aria-label={MENU_ARIA_LABEL}
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
                    aria-label={CLOSE_MENU_ARIA_LABEL}
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div id={panelId} className={styles.mobilePanel}>
                    <nav aria-label={NAV_ARIA_LABEL} className={styles.mobileNav}>
                      <ul className={styles.mobileNavList}>
                        {navItems.map((item) => (
                          <li key={item.id}>
                            <a
                              className={styles.mobileNavLink}
                              href={resolveNavHref(item.id)}
                              onClick={onAnchorClick(item.id)}
                              data-active={activeSectionId === item.id ? 'true' : 'false'}
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
          </div>
        )}
      </div>
    </header>
  );
}
