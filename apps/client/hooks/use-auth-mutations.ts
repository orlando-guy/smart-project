import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LoginUserInput } from '@repo/shared';

export function useLoginMutation() {
    return useMutation({
        mutationFn: async (credentials: LoginUserInput) => {
            const response = await api.post('/users/auth/login', credentials);
            return response.data; // Attend un format: { token: "...", user: {...} }
        },
    })
}