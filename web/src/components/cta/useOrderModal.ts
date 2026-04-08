import { useContext } from 'react';
import { OrderModalContext } from './OrderModalShared';

export function useOrderModal() {
  const context = useContext(OrderModalContext);

  if (!context) {
    throw new Error('useOrderModal must be used inside OrderModalProvider');
  }

  return context;
}
