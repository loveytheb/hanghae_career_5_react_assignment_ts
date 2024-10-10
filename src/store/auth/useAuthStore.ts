import { IUser } from '@/types/authType';
import { create } from 'zustand';

interface AuthState {
  isLogin: boolean;
  user: IUser | null;
  setIsLogin: (isLogin: boolean) => void;
  setUser: (user: IUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLogin: false,
  user: null,

  setIsLogin: (isLogin) => set({ isLogin }),

  setUser: (user) =>
    set({
      user,
      isLogin: true,
    }),

  logout: () =>
    set({
      isLogin: false,
      user: null,
    }),
}));
