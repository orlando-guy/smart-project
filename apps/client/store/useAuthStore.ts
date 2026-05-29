import { create } from 'zustand';
import { UserResponse } from '@repo/shared';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    user: UserResponse | null,
    setAuth: (token: string, user: AuthState['user']) => void;
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setAuth: (token, user) => {
                set({ token, user })
            },
            logout: () => set({ token: null, user: null })
        }),
        {
            name: 'auth-storage', // Clé utilisée dans le localStorage
            storage: createJSONStorage(() => localStorage)
        }
    )
);