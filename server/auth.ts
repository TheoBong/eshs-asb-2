import bcrypt from 'bcryptjs';
import session from 'express-session';
import MemoryStore from 'memorystore';
import type { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const MemStore = MemoryStore(session);

// Session configuration
export const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-this',
  resave: false,
  saveUninitialized: false,
  store: new MemStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
});

// Extend session type
declare module 'express-session' {
  interface SessionData {
    isAuthenticated: boolean;
    adminAuthenticated: boolean;
  }
}

// Hash the admin password on startup
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(
  process.env.ADMIN_PASSWORD || 'admin',
  10
);

// Authentication middleware
export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.adminAuthenticated) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// Login endpoint handler
export const handleAdminLogin = async (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

  if (isValid) {
    req.session.adminAuthenticated = true;
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Failed to save session' });
      }
      res.json({ success: true });
    });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
};

// Logout endpoint handler
export const handleAdminLogout = (req: Request, res: Response) => {
  req.session.adminAuthenticated = false;
  req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      return res.status(500).json({ error: 'Failed to save session' });
    }
    res.json({ success: true });
  });
};

// Check auth status endpoint handler
export const checkAdminAuth = (req: Request, res: Response) => {
  res.json({ authenticated: !!req.session.adminAuthenticated });
};