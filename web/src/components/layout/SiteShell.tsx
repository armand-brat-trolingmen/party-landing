import { SpeedInsights } from '@vercel/speed-insights/react';
import type { ReactNode } from 'react';
import { OrderModal } from '../cta/OrderModal';
import { OrderModalProvider } from '../cta/OrderModalContext';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

type SiteShellProps = {
  children: ReactNode;
  motionPath?: string;
  mainClassName?: string;
  legalMode?: boolean;
};

export function SiteShell({ children, motionPath, mainClassName, legalMode = false }: SiteShellProps) {
  return (
    <OrderModalProvider>
      <SiteHeader legalMode={legalMode} />
      <main className={mainClassName ?? 'site-shell'} data-motion-path={motionPath} data-shell-theme="premium-editorial">
        {children}
      </main>
      <SiteFooter />
      <OrderModal />
      <SpeedInsights />
    </OrderModalProvider>
  );
}
