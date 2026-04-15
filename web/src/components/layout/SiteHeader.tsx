import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react';
import { flushSync } from 'react-dom';
import { useLocation } from 'react-router';
import { siteConfig } from '../../content';
import { DonutLogo } from '../branding/DonutLogo';
import { useOrderModal } from '../cta/useOrderModal';
import {
  resolveHeaderCompactState,
  resolveHeaderScrollProgress,
  resolveMobileBrandTextShift,
} from './SiteHeaderScrollState';
import styles from './SiteHeader.module.css';

type SiteHeaderProps = {
  legalMode?: boolean;
};

function getDocumentTop(element: HTMLElement) {
  return element.getBoundingClientRect().top + window.scrollY;
}

const NAV_ARIA_LABEL = '\u041e\u0441\u043d\u043e\u0432\u043d\u0430\u044f \u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f';
const MENU_ARIA_LABEL = '\u041c\u0435\u043d\u044e';
const CLOSE_MENU_ARIA_LABEL = '\u0417\u0430\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e';
const ORDER_LABEL = '\u0417\u0430\u043a\u0430\u0437\u0430\u0442\u044c';
const MOBILE_HEADER_BREAKPOINT_PX = 1080;
const navItems = siteConfig.navigation;

export function SiteHeader({ legalMode = false }: SiteHeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const brandPlateRef = useRef<HTMLSpanElement | null>(null);
  const brandTextRef = useRef<HTMLSpanElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const navigationLockRef = useRef<{ id: string; unlockAt: number } | null>(null);
  const panelId = useId();
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';
  const { openModal } = useOrderModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isScrolled, setIsScrolled] = useState(() => !isHomeRoute || legalMode);
  const [scrollProgress, setScrollProgress] = useState(() => (!isHomeRoute || legalMode ? 1 : 0));
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const prepareCompactHeaderForJump = useCallback(() => {
    const header = headerRef.current;
    if (!header) {
      return () => undefined;
    }

    header.dataset.headerLock = 'jump';
    flushSync(() => {
      setIsScrolled(true);
      setScrollProgress(1);
    });

    return () => {
      window.requestAnimationFrame(() => {
        if (headerRef.current === header) {
          delete header.dataset.headerLock;
        }
      });
    };
  }, []);

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
      if (!target) {
        return;
      }

      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
      const shouldPrepareCompactHeader = isDesktop && isHomeRoute && id !== 'hero';
      const releaseHeaderLock = shouldPrepareCompactHeader ? prepareCompactHeaderForJump() : () => undefined;
      const performScroll = () => {
        const top = getSectionScrollTop(target);
        window.scrollTo({ top, behavior });
        releaseHeaderLock();
      };

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(performScroll);
        return;
      }

      window.setTimeout(performScroll, 0);
    },
    [getSectionScrollTop, isDesktop, isHomeRoute, prepareCompactHeaderForJump],
  );

  const onAnchorClick = useCallback(
    (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      if (!canScrollInCurrentPage(id)) {
        if (!isDesktop) {
          setIsMenuOpen(false);
        }
        return;
      }

      event.preventDefault();

      if (!isDesktop) {
        setIsMenuOpen(false);
      }

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
    if (!window.matchMedia) {
      return;
    }

    const query = window.matchMedia(`(min-width: ${MOBILE_HEADER_BREAKPOINT_PX + 1}px)`);
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
    if (!isMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return;
    }

    const root = document.documentElement;
    const sync = () => {
      const height = header.getBoundingClientRect().height;
      if (!Number.isFinite(height) || height <= 0) {
        return;
      }

      const nextHeight = `${Math.ceil(height)}px`;
      const currentShellOffset = Number.parseFloat(root.style.getPropertyValue('--header-shell-offset'));
      const shouldHoldHomeShellOffset = isHomeRoute && !legalMode && scrollProgress > 0.001;

      root.style.setProperty('--header-offset', nextHeight);

      if (
        !shouldHoldHomeShellOffset ||
        !Number.isFinite(currentShellOffset) ||
        currentShellOffset < height
      ) {
        root.style.setProperty('--header-shell-offset', nextHeight);
      }
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
  }, [isHomeRoute, legalMode, scrollProgress]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let rafId = 0;

    const sync = () => {
      if (legalMode) {
        setActiveSectionId(null);
        setScrollProgress(1);
        setIsScrolled(true);
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

      const nextProgress = isHomeRoute ? resolveHeaderScrollProgress({ isDesktop, scrollY: window.scrollY }) : 1;
      setActiveSectionId((current) => (current === nextActive ? current : nextActive));
      setScrollProgress((current) => (current === nextProgress ? current : nextProgress));
      setIsScrolled((current) =>
        isHomeRoute ? resolveHeaderCompactState({ current, isDesktop, scrollY: window.scrollY }) : true,
      );
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId) {
        return;
      }

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
  }, [canScrollInCurrentPage, getSectionScrollTop, isDesktop, isHomeRoute, legalMode]);

  useEffect(() => {
    if (!location.hash || legalMode) {
      return;
    }

    const id = location.hash.replace('#', '');
    if (!canScrollInCurrentPage(id)) {
      return;
    }

    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
    const shouldPrepareCompactHeader = isDesktop && isHomeRoute && id !== 'hero';
    const releaseHeaderLock = shouldPrepareCompactHeader ? prepareCompactHeaderForJump() : () => undefined;
    const performScroll = () => {
      const top = getSectionScrollTop(target);
      window.scrollTo({ top, behavior });
      releaseHeaderLock();
    };

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(performScroll);
      return;
    }

    window.setTimeout(performScroll, 0);
  }, [canScrollInCurrentPage, getSectionScrollTop, isDesktop, isHomeRoute, legalMode, location.hash, location.pathname, prepareCompactHeaderForJump]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) {
      return;
    }

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

  useLayoutEffect(() => {
    const header = headerRef.current;
    const brandPlate = brandPlateRef.current;
    const brandText = brandTextRef.current;
    const menuButton = menuButtonRef.current;

    if (!header) {
      return;
    }

    const resetShift = () => {
      header.style.setProperty('--mobile-brand-text-shift', '0px');
    };

    if (isDesktop || !brandPlate || !brandText || !menuButton) {
      resetShift();
      return;
    }

    if (!isScrolled) {
      resetShift();
      return;
    }

    const syncShift = () => {
      const brandLogo = brandPlate.querySelector('[data-testid="donut-logo"]') as HTMLElement | null;
      const currentShift = Number.parseFloat(header.style.getPropertyValue('--mobile-brand-text-shift') || '0');
      const nextShift = resolveMobileBrandTextShift({
        currentShift: Number.isFinite(currentShift) ? currentShift : 0,
        plateRight: brandLogo?.getBoundingClientRect().right ?? brandPlate.getBoundingClientRect().right,
        textLeft: brandText.getBoundingClientRect().left,
        textWidth: brandText.getBoundingClientRect().width,
        menuLeft: menuButton.getBoundingClientRect().left,
      });

      header.style.setProperty('--mobile-brand-text-shift', `${nextShift.toFixed(2)}px`);
    };

    syncShift();

    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncShift);
      resizeObserver.observe(header);
      resizeObserver.observe(brandPlate);
      resizeObserver.observe(brandText);
      resizeObserver.observe(menuButton);
    }

    window.addEventListener('resize', syncShift);
    return () => {
      window.removeEventListener('resize', syncShift);
      resizeObserver?.disconnect();
    };
  }, [isDesktop, isScrolled]);

  const brandHref = !legalMode && isHomeRoute ? '#hero' : '/';
  const headerStyle = { '--header-progress': scrollProgress.toFixed(4) } as CSSProperties;

  return (
    <header
      className={styles.header}
      ref={headerRef}
      style={headerStyle}
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
          aria-label={siteConfig.brand.name}
        >
          <span className={styles.brandPlate} data-testid="brand-plate" ref={brandPlateRef}>
            <DonutLogo className={styles.logoMark} size={240} />
          </span>
          <span className={styles.brandText} ref={brandTextRef}>
            {siteConfig.brand.name}
          </span>
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
                  <span className={styles.headerCtaLabel}>{ORDER_LABEL}</span>
                  <span className={styles.headerCtaArrow} data-testid="header-order-button-arrow" aria-hidden="true">
                    {'\u2192'}
                  </span>
                </span>
              </button>
            ) : null}
          </div>
        ) : (
          <div className={styles.mobileActions}>
            <div className={styles.mobile}>
              <button
                type="button"
                className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonOpen : ''}`}
                ref={menuButtonRef}
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
                        {!legalMode ? (
                          <li>
                            <button
                              type="button"
                              className={styles.mobileMenuOrderLink}
                              data-testid="mobile-menu-order-button"
                              onClick={() => {
                                setIsMenuOpen(false);
                                openModal();
                              }}
                            >
                              <span>{ORDER_LABEL}</span>
                              <span className={styles.mobileMenuOrderArrow} aria-hidden="true">
                                {'\u2192'}
                              </span>
                            </button>
                          </li>
                        ) : null}
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
