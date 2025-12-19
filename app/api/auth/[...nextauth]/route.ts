import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: any) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required');
                }

                try {
                    // Call backend auth endpoint
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password,
                            }),
                        }
                    );

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                        throw new Error(data.error || 'Authentication failed');
                    }

                    // Backend returns: { success: true, data: { user, token } } or { success: true, user, token }
                    const userData = data.data?.user || data.user;
                    const token = data.data?.token || data.token;

                    if (!userData || !token) {
                        console.error('Invalid backend response structure:', data);
                        throw new Error('Invalid response from server');
                    }

                    // Check if user is admin
                    if (userData.role !== 'ADMIN') {
                        throw new Error('Access denied. Admin privileges required.');
                    }

                    return {
                        id: userData.id,
                        email: userData.email,
                        role: userData.role,
                        token: token,
                        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
                    };
                } catch (error: any) {
                    console.error('Auth error:', error);
                    throw new Error(error.message || 'Authentication failed');
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.accessToken = user.token;
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.accessToken = token.accessToken as string;
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt' as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
