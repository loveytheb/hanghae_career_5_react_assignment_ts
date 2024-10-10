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

  setIsLogin: (isLogin) => {
    set({ isLogin });
    if (isLogin) {
      localStorage.setItem('isLogin', 'true');
    } else {
      localStorage.removeItem('isLogin');
      localStorage.removeItem('user');
    }
  },

  setUser: (user) => {
    set({
      user,
      isLogin: true,
    });
    localStorage.setItem('user', JSON.stringify(user));
  },

  logout: () =>
    set({
      isLogin: false,
      user: null,
    }),
}));
