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