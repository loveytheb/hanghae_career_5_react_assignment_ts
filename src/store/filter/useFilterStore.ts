import { create } from 'zustand';
import { ALL_CATEGORY_ID } from '@/constants';

interface FilterState {
  minPrice: number;
  maxPrice: number;
  title: string;
  categoryId: string;
  setMinPrice: (minPrice: number) => void;
  setMaxPrice: (maxPrice: number) => void;
  setTitle: (title: string) => void;
  setCategoryId: (categoryId: string) => void;
  resetFilter: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  minPrice: 0,
  maxPrice: 0,
  title: '',
  categoryId: ALL_CATEGORY_ID,
  setMinPrice: (minPrice) => set({ minPrice }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setTitle: (title) => set({ title }),
  setCategoryId: (categoryId) => set({ categoryId }),
  resetFilter: () =>
    set({ minPrice: 0, maxPrice: 0, title: '', categoryId: ALL_CATEGORY_ID }),
}));
