import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

/* 
    Automatisation de l'envoi du token JWT à l'API Node.js,
    via la configuration d'un client Axios capable de lire
    l'état actuel de Zustand à chaque requête.
*/

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Intercepteur pour injecter automatiquement le token de Zustand
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token; // Recupère le token à la volée
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

/*
    Dès que votre API Node.js renverra un code de statut 401 Unauthorized
    (signalant que le token a expiré ou est invalide),
    l'intercepteur interviendra automatiquement pour nettoyer
    le store Zustand, supprimer le cookie, et rediriger l'utilisateur
    vers la page de connexion axios-http.com.
*/
// Intercepteur de RÈPONNSE - gère l'expiration du token / 401
api.interceptors.response.use(
    (response) => {
        // Si la réponse est un succès, on la retourne simplement
        return response;
    },
    (error) => {
        // Vérifie si l'érreur provient de l'API et possède un statut 401
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            // Étape A : Vider le store Zustand et le localStorage
            useAuthStore.getState().logout();

            // Étape B : Supprimer le cookie d'authentification pour le middleware
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';

            // Étape C : Redirection forcée vers la page de connexion
            // Étan donné que nous sommes hors d'un composant React, on utilise l'API native du navigateur
            if (globalThis.window !== undefined) {
                globalThis.window.location.href = '/login?expired=true';
            }
        }

        // Renvoie l'érreur pour que TanStack Query puisse aussi la capturer si nécessaire
        return Promise.reject(error)
    }
)