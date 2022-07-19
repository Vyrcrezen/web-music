import session from 'express-session';

declare module 'express-session' {
    interface SessionData {
        passport?: {
            user?: {
                authenticated: boolean,
                id: string
            }
        };
    }
}
