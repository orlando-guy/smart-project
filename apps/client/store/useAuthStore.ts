import { create } from 'zustand';
import { UserResponse } from '@repo/shared'

interface AuthState {
    token: string | null;
    user: UserResponse | null,
    setAuth: (token: string, user: AuthState['user']) => void;
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    setAuth: (token, user) => set({ token, user }),
    logout: () => set({ token: null, user: null })
}))