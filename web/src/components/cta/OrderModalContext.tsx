import { useMemo, useState, type ReactNode } from 'react';
import { OrderModalContext, type OrderModalContextValue } from './OrderModalShared';

export function OrderModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<OrderModalContextValue>(
    () => ({
      isOpen,
      openModal: () => setIsOpen(true),
      closeModal: () => setIsOpen(false),
    }),
    [isOpen],
  );

  return <OrderModalContext.Provider value={value}>{children}</OrderModalContext.Provider>;
}
