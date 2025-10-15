// Type definitions for Portify
import 'express-session';

// Extend express-session to include our custom properties
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    user?: {
      id: string;
      email?: string;
      firstName?: string;
      lastName?: string;
    };
  }
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface User {
      id: string;
      email?: string;
      firstName?: string;
      lastName?: string;
    }
  }
}

export {};
