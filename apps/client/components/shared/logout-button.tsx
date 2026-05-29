import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'

const LogoutButton = () => {
    const router = useRouter()
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        // Vide le store Zustand (et nettoie le localstorage)
        logout();

        // 2. Supprime le cookie en changeant sa date d'expiration dasn le passé
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'

        // 3. Redirige vers la page de connexion
        router.push('/login');
    }

    return (
        <Button variant="destructive" onClick={handleLogout}>
            Déconnexion
        </Button>
    )
}

export default LogoutButton