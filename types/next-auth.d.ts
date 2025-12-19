import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
    }

    interface User {
        id: string;
        email: string;
        role: string;
        token: string;
        name: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string;
        role: string;
        id: string;
    }
}
