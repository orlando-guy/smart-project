import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuth() {
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        // S'abonne au statut d'hydratation du store Zustand
        const unsubHydrate = useAuthStore.persist.onHydrate(() => setHydrated(false));
        const unsubFinish = useAuthStore.persist.onFinishHydration(() => setHydrated(true))

        // Vérification initiale au cas où c'est déjà fait
        if (useAuthStore.persist.hasHydrated()) {
            setHydrated(true);
        }

        return () => {
            unsubHydrate();
            unsubFinish();
        }
    }, []);

    return {
        user: hydrated ? user : null,
        token: hydrated ? token : null,
        isHydrated: hydrated
    }
}