# Portify - Portfolio Builder Platform

## Project Overview

Portify is a modern portfolio builder platform that allows users to create stunning portfolios in minutes using 1000+ professional templates. The platform features 3D, animated, minimal, and futuristic designs targeting developers, designers, gamers, and creators.

**Key Value Proposition:**
- 1000+ pre-made portfolio templates
- No code required - fully visual builder
- Instant publishing with custom subdomains (username.portify.io)
- Template switching without data loss
- Real-time analytics and engagement tracking

## Recent Changes

### Phase 2: Supabase Migration & AI Integration (Completed)
**Date:** October 15, 2025

- **Backend Migration to Supabase:**
  - ✅ Migrated from Replit Auth to custom session-based auth
  - ✅ Updated database connection to use Supabase PostgreSQL
  - ✅ Password hashes stored securely in database (bcrypt)
  - ✅ Created new auth endpoints (signup, signin, signout)
  - ✅ Updated all API routes to use new auth middleware
  - ✅ Pushed database schema to Supabase successfully
  - ✅ Added passwordHash column to users table for persistent authentication

- **AI-Powered Portfolio Customization:**
  - ✅ Integrated OpenAI GPT-5 for AI-powered content generation
  - ✅ Created AI service with two main functions:
    - `generatePortfolioContent()` - Generates personalized portfolio data from user input
    - `customizeTemplate()` - Automatically fills templates with user information
  - ✅ Added AI API endpoints:
    - `/api/ai/generate-portfolio` - Generate portfolio content (protected)
    - `/api/ai/customize-template` - Customize templates with user data (protected)

- **Frontend Updates:**
  - ✅ Created new authentication page (`/auth`) with sign in/sign up tabs
  - ✅ Updated all login links from `/api/login` to `/auth`
  - ✅ Maintained existing UI/UX and dark mode theme
  - 🔄 AI integration in onboarding flow (pending)

### Phase 1: Schema & Frontend (Completed)
**Date:** October 15, 2025

- Defined complete data models for users, portfolios, templates, projects, and social links
- Configured design system with Inter font and vibrant purple/cyan color scheme
- Built all React components:
  - Landing page with hero, features, pricing sections
  - Template Gallery with filters and live preview
  - Multi-step Onboarding flow (4 steps)
  - User Dashboard with stats and quick actions
  - Portfolio Editor with tabs for profile, projects, and social links
- Implemented dark mode with ThemeProvider
- Added Replit Auth integration
- Created responsive layouts following design_guidelines.md

## Architecture

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Wouter for client-side routing
- TanStack Query v5 for data fetching
- React Hook Form with Zod validation
- Shadcn UI components with Tailwind CSS
- Lucide React icons

**Backend:**
- Express.js with TypeScript
- Supabase PostgreSQL database
- Drizzle ORM
- Supabase Auth (email/password)
- Session management with connect-pg-simple
- OpenAI GPT-5 for AI features

**Design System:**
- Primary color: Purple (265 85% 62%)
- Accent color: Cyan (180 75% 55%)
- Font: Inter (400, 500, 600, 700, 800)
- Dark mode first approach
- Consistent spacing using Tailwind scale

### Database Schema

**Core Tables:**
1. `users` - User accounts (Replit Auth)
2. `sessions` - Session storage (Replit Auth)
3. `portfolios` - User portfolio data
4. `templates` - Template catalog (1000+ templates)
5. `projects` - Portfolio projects showcase
6. `social_links` - User social media links

**Relations:**
- User → Portfolios (one-to-many)
- Portfolio → Template (many-to-one)
- Portfolio → Projects (one-to-many)
- Portfolio → Social Links (one-to-many)

### API Routes

**Auth Routes:**
- `GET /api/auth/user` - Get current user (protected)
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in with email/password
- `POST /api/auth/signout` - Sign out user

**Portfolio Routes:**
- `GET /api/portfolios` - List user portfolios (protected)
- `POST /api/portfolios` - Create portfolio (protected)
- `PATCH /api/portfolios/:id` - Update portfolio (protected)

**Template Routes:**
- `GET /api/templates` - Browse templates (public/protected)
- `GET /api/templates/:id` - Get template details

**Project Routes:**
- `GET /api/projects?portfolioId=:id` - List projects (protected)
- `POST /api/projects` - Add project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

**Social Link Routes:**
- `GET /api/social-links?portfolioId=:id` - List social links (protected)
- `POST /api/social-links` - Add social link (protected)
- `DELETE /api/social-links/:id` - Delete social link (protected)

**AI Routes:**
- `POST /api/ai/generate-portfolio` - Generate portfolio content with AI (protected)
- `POST /api/ai/customize-template` - Customize template with user data (protected)

## User Preferences

### Design Guidelines
- Follow design_guidelines.md religiously for all UI implementations
- Use dark mode as primary (dark-first design)
- Maintain consistent spacing: micro (1-4), component (4-8), section (12-24)
- Use vibrant colors sparingly for CTAs and highlights
- Ensure pixel-perfect responsive design across breakpoints

### Development Workflow
- Schema-first approach: Define data models before implementation
- Horizontal batching: Build complete layers across all features
- Frontend quality is paramount - exceptional visual design required
- Use Replit Auth for authentication
- PostgreSQL for data persistence
- Test all critical user journeys

## Project Structure

```
/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Shadcn components
│   │   │   ├── theme-provider.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── lib/
│   │   │   ├── authUtils.ts
│   │   │   └── queryClient.ts
│   │   ├── pages/
│   │   │   ├── landing.tsx   # Marketing landing page
│   │   │   ├── templates.tsx # Template gallery
│   │   │   ├── onboarding.tsx # Multi-step onboarding
│   │   │   ├── dashboard.tsx # User dashboard
│   │   │   └── editor.tsx    # Portfolio editor
│   │   ├── App.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   ├── db.ts              # Database connection
│   ├── storage.ts         # Storage layer (DatabaseStorage)
│   ├── routes.ts          # API routes
│   ├── replitAuth.ts      # Replit Auth setup
│   └── index.ts
├── shared/
│   └── schema.ts          # Shared types and schemas
├── design_guidelines.md   # Design specifications
└── replit.md             # This file

## MVP Features Status

### ✅ Completed (Phase 1)
- [x] User authentication with Replit Auth
- [x] Multi-step onboarding flow
- [x] Template gallery UI with filters
- [x] User dashboard with stats
- [x] Portfolio editor (profile, projects, social links)
- [x] Dark mode toggle
- [x] Responsive design
- [x] Landing page with marketing content

### 🚧 In Progress (Phase 2)
- [ ] Backend API implementation
- [ ] Database schema migration
- [ ] CRUD operations for all entities
- [ ] Portfolio publishing logic
- [ ] Template data seeding

### 📋 Pending (Phase 3)
- [ ] Frontend-backend integration
- [ ] Error handling and loading states
- [ ] End-to-end testing
- [ ] Portfolio subdomain publishing
- [ ] Analytics dashboard

## Next Steps

### Immediate Tasks (Phase 2)
1. Set up Replit Auth backend (server/replitAuth.ts)
2. Create database tables with Drizzle migration
3. Implement all API endpoints
4. Add request validation with Zod
5. Implement business logic for portfolio publishing
6. Seed initial template data (1000+ templates)

### Future Enhancements
- AI-powered content suggestions
- Custom domain support
- Advanced analytics
- Template marketplace
- QR code generation for portfolios
- AI resume builder
- Public discover page

## Important Notes

- **Template Source:** User has 1000 existing portfolios as templates (format TBD)
- **Authentication:** Using Replit Auth (supports Google, GitHub, X, Apple, email/password)
- **Database:** PostgreSQL with Drizzle ORM
- **Session Management:** Database-backed sessions (required for Replit Auth)
- **Design First:** Visual quality is paramount - pixel-perfect implementation required

## Environment Variables

Required environment variables:
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key (optional, has default)
- `OPENAI_API_KEY` - OpenAI API key for AI features

## Running the Project

The workflow "Start application" runs `npm run dev` which:
1. Starts Express server on backend
2. Starts Vite dev server on frontend
3. Both served on same port via Vite proxy

Database migrations:
```bash
npm run db:push        # Push schema changes
npm run db:push --force # Force push if needed
```
