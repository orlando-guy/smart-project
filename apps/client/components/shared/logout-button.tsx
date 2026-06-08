import { clearAuthSession } from '@/lib/auth-util'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'

const LogoutButton = () => {
    const router = useRouter()

    const handleLogout = () => {
        clearAuthSession();
        router.push('/login');
    }

    return (
        <Button variant="destructive" onClick={handleLogout}>
            Deconnexion
        </Button>
    )
}

export default LogoutButton
