import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Date de livraison prévue - MODIFIE CETTE DATE
// MAINTENANCE MODE DISABLED - Date set to past
const DELIVERY_DATE = new Date('2020-01-01T00:00:00');

// Clé secrète pour accès développeur (optionnel)
const DEVELOPER_ACCESS_KEY = 'dev_access_2026'; // Change cette clé

export function middleware(request: NextRequest) {
    const now = new Date();
    const pathname = request.nextUrl.pathname;

    // Vérifier si la date de livraison est passée
    if (now >= DELIVERY_DATE) {
        // Date de livraison atteinte, laisser passer
        return NextResponse.next();
    }

    // Toujours autoriser l'accès à ces routes (même en mode maintenance)
    const allowedPaths = [
        '/maintenance',
        '/login',
        '/api/auth',  // NextAuth routes
    ];

    // Vérifier si le chemin actuel est dans les chemins autorisés
    if (allowedPaths.some(path => pathname.startsWith(path))) {
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
