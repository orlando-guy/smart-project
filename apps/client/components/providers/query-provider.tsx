'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { useState } from 'react';

/*
    Pour éviter les fuites de mémoire et le partage de cache
    entre utilisateurs sur le serveur Next.js, le QueryClient
    doit être instancié de manière isolée au niveau d'un
    composant client.
*/

export default function QueryProvider({children}: Readonly<{
    children: React.ReactNode;
}>) {
    // Garantie une instance unique du client par session du navigateur
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // Les données sont considérées fraiches pendant 5 min
                retry: 1
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}