import { IProduct } from '@/api/dtos/productDTO';
import { ProductFilter } from '@/types/productType';
import { create } from 'zustand';

interface ProductStore {
  items: IProduct[];
  hasNextPage: boolean;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  filter: ProductFilter;
  loadProducts: (
    products: IProduct[],
    hasNextPage: boolean,
    totalCount: number,
    isInitial: boolean
  ) => void;
  addProduct: (product: IProduct) => void;
  updateFilter: (newFilter: ProductFilter) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  items: [],
  hasNextPage: true,
  isLoading: false,
  error: null,
  totalCount: 0,
  filter: {
    categoryId: '',
    title: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  },

  loadProducts: (products, hasNextPage, totalCount, isInitial) => {
    set((state) => ({
      items: isInitial ? products : [...state.items, ...products],
      hasNextPage,
      totalCount,
      isLoading: false,
      error: null,
    }));
  },

  addProduct: (product) => {
    set((state) => ({
      items: [product, ...state.items],
      totalCount: state.totalCount + 1,
      isLoading: false,
      error: null,
    }));
  },

  updateFilter: (newFilter) => set({ filter: newFilter }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
