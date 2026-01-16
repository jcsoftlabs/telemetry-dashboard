import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Date de livraison prévue - MODIFIE CETTE DATE
const DELIVERY_DATE = new Date('2026-01-31T00:00:00');

// Clé secrète pour accès développeur (optionnel)
const DEVELOPER_ACCESS_KEY = 'dev_access_2026'; // Change cette clé

export function middleware(request: NextRequest) {
    const now = new Date();

    // Vérifier si la date de livraison est passée
    if (now >= DELIVERY_DATE) {
        // Date de livraison atteinte, laisser passer
        return NextResponse.next();
    }

    // Vérifier si c'est déjà la page de maintenance
    if (request.nextUrl.pathname === '/maintenance') {
        return NextResponse.next();
    }

    // Vérifier si le développeur a la clé d'accès (optionnel)
    const accessKey = request.cookies.get('dev_access')?.value;
    if (accessKey === DEVELOPER_ACCESS_KEY) {
        return NextResponse.next();
    }

    // Rediriger vers la page de maintenance
    return NextResponse.redirect(new URL('/maintenance', request.url));
}

// Appliquer le middleware à toutes les routes sauf les fichiers statiques
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
