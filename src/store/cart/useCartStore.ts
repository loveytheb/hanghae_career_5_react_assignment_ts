import { CartItem } from '@/types/cartType';
import {
  calculateTotal,
  getCartFromLocalStorage,
  resetCartAtLocalStorage,
  setCartToLocalStorage,
} from '@/store/cart/cartUtils';
import { create } from 'zustand';

interface CartState {
  cart: CartItem[];
  totalCount: number;
  totalPrice: number;
  initCart: (userId: string) => void;
  resetCart: (userId: string) => void;
  addCartItem: (item: CartItem, userId: string, count: number) => void;
  removeCartItem: (itemId: string, userId: string) => void;
  changeCartItemCount: (itemId: string, count: number, userId: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  totalCount: 0,
  totalPrice: 0,

  initCart: (userId: string) => {
    if (!userId) return;
    const prevCartItems = getCartFromLocalStorage(userId);
    const total = calculateTotal(prevCartItems);
    set({
      cart: prevCartItems,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    });
  },

  resetCart: (userId: string) => {
    resetCartAtLocalStorage(userId);
    set({
      cart: [],
      totalCount: 0,
      totalPrice: 0,
    });
  },

  addCartItem: (item, userId, count) => {
    set((state) => {
      const existingItemIndex = state.cart.findIndex(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItemIndex !== -1) {
        state.cart[existingItemIndex].count += count;
      } else {
        state.cart.push({ ...item, count });
      }

      const total = calculateTotal(state.cart);
      setCartToLocalStorage(state.cart, userId);

      return {
        cart: state.cart,
        totalCount: total.totalCount,
        totalPrice: total.totalPrice,
      };
    });
  },

  removeCartItem: (itemId: string, userId: string) => {
    set((state) => {
      const newCart = state.cart.filter((item) => item.id !== itemId);
      const total = calculateTotal(newCart);
      setCartToLocalStorage(newCart, userId);

      return {
        cart: newCart,
        totalCount: total.totalCount,
        totalPrice: total.totalPrice,
      };
    });
  },

  changeCartItemCount: (itemId: string, count: number, userId: string) => {
    set((state) => {
      const itemIndex = state.cart.findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        const newCart = [...state.cart];
        newCart[itemIndex].count = count;
        const total = calculateTotal(newCart);
        setCartToLocalStorage(newCart, userId);

        return {
          cart: newCart,
          totalCount: total.totalCount,
          totalPrice: total.totalPrice,
        };
      }
      return state;
    });
  },
}));
