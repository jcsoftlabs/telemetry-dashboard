import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // Allow access to login page and auth API routes without token
    if (
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/api/auth')
    ) {
        return NextResponse.next();
    }

    // Redirect to login if no token
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - /login (authentication page)
         * - /api/auth/* (auth API routes)
         * - /_next/* (Next.js internals)
         * - /favicon.ico, /images/* (static files)
         */
        '/((?!login|api/auth|_next|favicon.ico|images).*)',
    ],
};
