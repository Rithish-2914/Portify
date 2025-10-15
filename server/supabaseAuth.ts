// Supabase Authentication Setup
import { createClient } from '@supabase/supabase-js';
import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import './types'; // Import session type extensions

// Extract Supabase URL from DATABASE_URL
// DATABASE_URL format: postgresql://[user]:[password]@[host]/[database]
function getSupabaseUrl(): string {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL not set");
  }
  
  // Extract host from connection string
  const match = dbUrl.match(/@([^/]+)\//);
  if (!match) {
    throw new Error("Invalid DATABASE_URL format");
  }
  
  const host = match[1];
  // Supabase URL format: https://[project-ref].supabase.co
  const projectRef = host.split('.')[0];
  return `https://${projectRef}.supabase.co`;
}

// Initialize Supabase client
export const supabase = createClient(
  getSupabaseUrl(),
  process.env.SUPABASE_ANON_KEY || '', // Will be optional for now
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    }
  }
);

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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      
      // Store user in session
      if (data.user) {
        req.session.userId = data.user.id;
        req.session.user = {
          id: data.user.id,
          email: data.user.email,
          firstName,
          lastName,
        };
      }
      
      res.json({ user: data.user });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Sign in endpoint
  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return res.status(401).json({ message: error.message });
      }
      
      // Store user in session
      if (data.user) {
        req.session.userId = data.user.id;
        req.session.user = {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.user_metadata?.first_name,
          lastName: data.user.user_metadata?.last_name,
        };
      }
      
      res.json({ user: data.user });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Sign out endpoint
  app.post("/api/auth/signout", async (req, res) => {
    try {
      await supabase.auth.signOut();
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
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      res.json({
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.first_name,
        lastName: data.user.user_metadata?.last_name,
      });
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
