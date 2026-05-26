import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LoginUserInput, type User as RegisterUserInput } from '@repo/shared';

export function useLoginMutation() {
    return useMutation({
        mutationFn: async (credentials: LoginUserInput) => {
            const response = await api.post('/users/auth/login', credentials);
            return response.data; // Attend un format: { token: "...", user: {...} }
        },
    })
}

export function useSignupMutation() {
    return useMutation({
        mutationFn: async (userRegistionData: RegisterUserInput) => {
            const response = await api.post('/users/auth/register', userRegistionData);
            return response.data;
        }
    })
}