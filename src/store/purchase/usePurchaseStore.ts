import { create } from 'zustand';

interface PurchaseState {
  isLoading: boolean;
  error: string | null;
  startPurchase: () => void;
  successPurchase: () => void;
  failurePurchase: (error: string) => void;
}

const usePurchaseStore = create<PurchaseState>((set) => ({
  isLoading: false,
  error: null,

  startPurchase: () => {
    set({ isLoading: true, error: null });
  },

  successPurchase: () => {
    set({ isLoading: false, error: null });
  },

  failurePurchase: (error) => {
    set({ isLoading: false, error });
  },
}));

export default usePurchaseStore;
