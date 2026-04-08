import { createContext } from 'react';

export type OrderModalContextValue = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const OrderModalContext = createContext<OrderModalContextValue | null>(null);
