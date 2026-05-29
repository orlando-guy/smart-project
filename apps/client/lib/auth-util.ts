import { useAuthStore } from "@/store/useAuthStore";
import { type UserResponse } from "@repo/shared";

interface AuthPayload {
    token?: string;
    user: UserResponse
}

type RouterLike = {
    push: (href: string) => void;
}

/**
 * Connecte instantanément l'utilisateur en mettant à jour le Store et le Cookie,
 * puis le redirige vers le tableau de bord.
 */
export const loginAndRedirect = (data: AuthPayload, router: RouterLike) => {
    if (!data?.token || !data.user) {
        console.error("Données d'authentification invalides");
        return null;
    }
    const { token, user } = data;
    // 1. Hydrate instantanément le store Zustand en mémoire
    useAuthStore.getState().setAuth(token, user);

    // Écrit le cookie pour le Middleware Next.js
    const secure = globalThis.location?.protocol === "https:" ? "; Secure" : "";
    document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax${secure}`;

    // Redirige SEULEMENT après s'être assuré que les données sont écrites
    router.push('/dashboard');
}