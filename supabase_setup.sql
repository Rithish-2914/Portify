-- ============================================================================
-- PORTIFY - SUPABASE DATABASE SETUP
-- ============================================================================
-- This SQL script sets up the complete database schema for Portify
-- Run this in your Supabase SQL Editor to create all necessary tables
-- ============================================================================

-- Create extension for UUID generation (if not exists)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SESSIONS TABLE (for session management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

-- ============================================================================
-- USERS TABLE (authentication and profiles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  is_admin BOOLEAN NOT NULL DEFAULT false,  -- Admin role flag
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================================
-- TEMPLATES TABLE (portfolio templates catalog)
-- ============================================================================
CREATE TABLE IF NOT EXISTS templates (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,  -- minimal, 3d, animated, visual, futuristic, gamer, etc.
  description TEXT,
  thumbnail_url VARCHAR(500),
  preview_url VARCHAR(500),
  html_content TEXT,  -- Template HTML code
  css_content TEXT,   -- Template CSS code
  js_content TEXT,    -- Template JavaScript code
  is_featured BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_featured ON templates(is_featured);

-- ============================================================================
-- PORTFOLIOS TABLE (user portfolio data)
-- ============================================================================
CREATE TABLE IF NOT EXISTS portfolios (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id VARCHAR REFERENCES templates(id),
  
  -- User profile data
  name VARCHAR(255) NOT NULL,
  tagline VARCHAR(500),
  bio TEXT,
  profession VARCHAR(100),
  profile_photo_url VARCHAR(500),
  
  -- Publishing data
  subdomain VARCHAR(100) UNIQUE,
  custom_domain VARCHAR(255),
  is_published BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_subdomain ON portfolios(subdomain);

-- ============================================================================
-- PROJECTS TABLE (portfolio projects showcase)
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  portfolio_id VARCHAR NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  project_url VARCHAR(500),
  tags TEXT[],  -- Array of tags/skills
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for portfolio queries
CREATE INDEX IF NOT EXISTS idx_projects_portfolio_id ON projects(portfolio_id);

-- ============================================================================
-- SOCIAL LINKS TABLE (user social media profiles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS social_links (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  portfolio_id VARCHAR NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  
  platform VARCHAR(50) NOT NULL,  -- github, twitter, linkedin, etc.
  url VARCHAR(500) NOT NULL,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for portfolio queries
CREATE INDEX IF NOT EXISTS idx_social_links_portfolio_id ON social_links(portfolio_id);

-- ============================================================================
-- CREATE FIRST ADMIN USER
-- ============================================================================
-- Replace the email and password with your admin credentials
-- Password is 'admin123' hashed with bcrypt (10 rounds)
-- You should change this password immediately after first login!

INSERT INTO users (id, email, password_hash, first_name, last_name, is_admin)
VALUES (
  'admin_' || gen_random_uuid()::text,
  'admin@portify.io',  -- CHANGE THIS to your email
  '$2b$10$YourHashedPasswordHere',  -- CHANGE THIS (see instructions below)
  'Admin',
  'User',
  true
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- HOW TO GENERATE YOUR ADMIN PASSWORD HASH
-- ============================================================================
-- Option 1: Using Node.js (Recommended)
-- Run this in your terminal:
/*
node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('YOUR_PASSWORD_HERE', 10));"
*/

-- Option 2: Using the signup endpoint
-- 1. Temporarily comment out the admin check in POST /api/templates
-- 2. Sign up through the app with your admin email
-- 3. Run this SQL to make that user an admin:
/*
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
*/

-- ============================================================================
-- SEED SOME SAMPLE TEMPLATES (Optional)
-- ============================================================================
-- These are placeholder templates for different themes

INSERT INTO templates (name, category, description, is_featured, html_content, css_content, js_content)
VALUES 
  (
    'Developer Portfolio - Dark',
    'developer',
    'A sleek dark-themed portfolio perfect for developers showcasing their projects and skills',
    true,
    '<div class="portfolio-container"><!-- Template HTML here --></div>',
    '/* Template CSS here */',
    '// Template JS here'
  ),
  (
    'Gamer Profile - Neon',
    'gamer',
    'Vibrant neon-themed portfolio for gamers with animated elements and gaming aesthetics',
    true,
    '<div class="portfolio-container"><!-- Template HTML here --></div>',
    '/* Template CSS here */',
    '// Template JS here'
  ),
  (
    'Designer Showcase - Minimal',
    'designer',
    'Clean minimal portfolio highlighting design work and creative projects',
    false,
    '<div class="portfolio-container"><!-- Template HTML here --></div>',
    '/* Template CSS here */',
    '// Template JS here'
  );

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify your setup:

-- Check if all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check admin user
SELECT id, email, first_name, last_name, is_admin FROM users WHERE is_admin = true;

-- Check templates
SELECT id, name, category, is_featured FROM templates ORDER BY created_at DESC;

-- ============================================================================
-- CLEANUP (if needed)
-- ============================================================================
-- DANGER: Only run this if you want to completely reset the database!
/*
DROP TABLE IF EXISTS social_links CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
*/

-- ============================================================================
-- POST-SETUP INSTRUCTIONS
-- ============================================================================
/*
1. Update the admin email in the INSERT statement above
2. Generate a password hash using bcrypt (see instructions above)
3. Replace '$2b$10$YourHashedPasswordHere' with your actual hash
4. Run this entire script in Supabase SQL Editor
5. Verify tables are created with the verification queries
6. Log in to the app with your admin credentials
7. Visit /admin to access the admin dashboard
8. Create templates for different themes:
   - Templates for developers
   - Templates for gamers
   - Templates for designers
   - And more!
*/
