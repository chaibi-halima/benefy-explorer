import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch, setTokenGetter } from '@/api/client';
import type { LoginResponse, User } from '@/api/types';

interface AuthState {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: async (email, password) => {
        const { token, user } = await apiFetch<LoginResponse>('/auth/login', {
          method: 'POST',
          body: { email, password },
        });
        set({ token, user });
      },
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'benefy-auth' },
  ),
);

setTokenGetter(() => useAuthStore.getState().token);
