import { create } from 'zustand';
import { User } from '../types';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: (() => {
    // 從 localStorage 讀取用戶資料
    const savedUser = localStorage.getItem('userId');
    return savedUser ? {
      id: savedUser,
      collections: {
        A1: {
          collectedPokemon: [],
          progress: 0
        }
      },
      lastUpdated: new Date()
    } : null;
  })(),
  
  setUser: (user) => {
    // 保存到 localStorage
    if (user?.id) {
      localStorage.setItem('userId', user.id);
    } else {
      localStorage.removeItem('userId');
    }
    set({ user });
  },
})); 