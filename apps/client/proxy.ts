import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    // Récupère le cookie d'authentification
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    // Cas 1 : L'utilisateur tente d'accéder au Dashboard sans être connecté
    if (pathname.startsWith('/dashboard') && !token) {
        // Redirige vers la page de connexion
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Cas 2 : L'utilisateur est déjà connecté et tente d'aller sur la page de connexion
    if (pathname.startsWith('/login') && token) {
        // Redirige directement ver le dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Cas 3 : L'utilisateur est déjà connecté et tente d'aller sur la page d'inscription
    if (pathname.startsWith('/sign-up') && token) {
        // Redirige directement ver le dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Laisse passer la requête si aucune condition n'est enfreinte
    NextResponse.next();
}

// Configuer les routes sur lesquelles le middleware doit s'exécuter
export const config = {
    matcher: ['/dashboard/:path*', '/login', '/sign-up']
}