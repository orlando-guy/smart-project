'use client'

import { useAuthStore } from "@/store/useAuthStore"
import { useAuth } from "@/hooks/use-auth";
import LogoutButton from "@/components/shared/logout-button";

export default function DashboardPage() {
    const { user, isHydrated } = useAuth()
   

    return (
        <main>
            <h1>Bienvenue sur votre tableau de bord, {user?.name}!</h1>

            <LogoutButton />
        </main>
    )
}