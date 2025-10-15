// Supabase Authentication Setup
// Using session-based auth with Supabase PostgreSQL database
import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import './types'; // Import session type extensions

// Simple password hashing (in production, use a proper auth service)
const hashPassword = (password: string) => bcrypt.hashSync(password, 10);
const comparePassword = (password: string, hash: string) => bcrypt.compareSync(password, hash);

// In-memory user store for demo (in production, use Supabase Auth or database)
const userStore = new Map<string, { email: string; password: string; firstName?: string; lastName?: string }>();

// Session configuration
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'portify-secret-key-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

// Setup Supabase auth routes
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  
  // Sign up endpoint
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      // Check if user already exists
      if (userStore.has(email)) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password and store user
      const hashedPassword = hashPassword(password);
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      userStore.set(email, {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });
      
      // Create user in database
      await storage.upsertUser({
        id: userId,
        email,
        firstName,
        lastName,
      });
      
      // Store user in session
      req.session.userId = userId;
      req.session.user = {
        id: userId,
        email,
        firstName,
        lastName,
      };
      
      res.json({ user: { id: userId, email, firstName, lastName } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Sign in endpoint
  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check if user exists
      const user = userStore.get(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Verify password
      if (!comparePassword(password, user.password)) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Get user from database
      const dbUser = await storage.getUserByEmail(email);
      if (!dbUser) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // Store user in session
      req.session.userId = dbUser.id;
      req.session.user = {
        id: dbUser.id,
        email: dbUser.email || email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      
      res.json({ user: { id: dbUser.id, email, firstName: user.firstName, lastName: user.lastName } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Sign out endpoint
  app.post("/api/auth/signout", async (req, res) => {
    try {
      req.session.destroy(() => {
        res.json({ message: "Signed out successfully" });
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get current user endpoint
  app.get("/api/auth/user", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}

// Authentication middleware
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Attach user to request
  req.user = req.session.user;
  next();
};
