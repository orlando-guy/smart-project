import { useAuthStore } from "@/store/useAuthStore";
import { type UserResponse } from "@repo/shared";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface AuthPayload {
    token?: string;
    user: UserResponse
}

/**
 * Connecte instantanément l'utilisateur en mettant à jour le Store et le Cookie,
 * puis le redirige vers le tableau de bord.
 */
export const loginAndRedirect = (data: AuthPayload, router: AppRouterInstance) => {
    if (!data?.token || !data.user) {
        console.error("Données d'authentification invalides");
        return null;
    }
    const { token, user } = data;
    // 1. Hydrate instantanément le store Zustand en mémoire
    useAuthStore.getState().setAuth(token, user);

    // Force Zustand à synchroniser le localStorage immédiatement
    useAuthStore.persist.rehydrate();

    // Écrit le cookie pour le Middleware Next.js
    document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;

    // Redirige SEULEMENT après s'être assuré que les données sont écrites
    router.push('/dashboard');
}