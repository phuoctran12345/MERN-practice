export interface User {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: string; // For backward compatibility with Express routes
    }
  }
}
