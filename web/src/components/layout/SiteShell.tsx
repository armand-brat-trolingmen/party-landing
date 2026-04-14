import { lazy, startTransition, Suspense, useEffect, useState, type ReactNode } from 'react';
import { ensureLeadSourceCookies } from '../../features/trafficSource/attribution';
import { useOrderModal } from '../cta/useOrderModal';
import { OrderModalProvider } from '../cta/OrderModalContext';
import { CookieBanner } from './CookieBanner';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

const LazyOrderModal = lazy(async () => {
  const module = await import('../cta/OrderModal');
  return { default: module.OrderModal };
});

const LazySpeedInsights = lazy(async () => {
  const module = await import('@vercel/speed-insights/react');
  return { default: module.SpeedInsights };
});

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

type SiteShellProps = {
  children: ReactNode;
  motionPath?: string;
  mainClassName?: string;
  legalMode?: boolean;
};

function DeferredOrderModal() {
  const { isOpen } = useOrderModal();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startTransition(() => {
        setShouldLoad(true);
      });
      return;
    }

    const load = () => {
      startTransition(() => {
        setShouldLoad(true);
      });
    };

    const idleWindow = window as IdleWindow;

    if (typeof idleWindow.requestIdleCallback === 'function' && typeof idleWindow.cancelIdleCallback === 'function') {
      const idleId = idleWindow.requestIdleCallback(load, { timeout: 1800 });
      return () => idleWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = globalThis.setTimeout(load, 900);
    return () => globalThis.clearTimeout(timeoutId);
  }, [isOpen]);

  if (!shouldLoad) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <LazyOrderModal />
    </Suspense>
  );
}

function DeferredSpeedInsights() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
      return;
    }

    const load = () => {
      startTransition(() => {
        setIsReady(true);
      });
    };

    const idleWindow = window as IdleWindow;

    if (typeof idleWindow.requestIdleCallback === 'function' && typeof idleWindow.cancelIdleCallback === 'function') {
      const idleId = idleWindow.requestIdleCallback(load, { timeout: 2400 });
      return () => idleWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = globalThis.setTimeout(load, 1200);
    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <LazySpeedInsights />
    </Suspense>
  );
}

export function SiteShell({ children, motionPath, mainClassName, legalMode = false }: SiteShellProps) {
  useEffect(() => {
    ensureLeadSourceCookies();
  }, []);

  return (
    <OrderModalProvider>
      <SiteHeader legalMode={legalMode} />
      <main className={mainClassName ?? 'site-shell'} data-motion-path={motionPath} data-shell-theme="premium-editorial">
        {children}
      </main>
      <SiteFooter />
      <CookieBanner />
      <DeferredOrderModal />
      <DeferredSpeedInsights />
    </OrderModalProvider>
  );
}
