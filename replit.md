# Portify - Portfolio Builder Platform

## Overview

Portify is a no-code portfolio builder platform designed to help users create professional, visually stunning portfolios in minutes. It offers over 1000 pre-designed templates, including 3D, animated, minimal, and futuristic styles, catering to a diverse range of professionals like developers, designers, gamers, and creators. The platform aims to provide instant publishing with custom subdomains, template switching without data loss, and real-time analytics, empowering users to showcase their work effectively and establish a strong online presence.

## User Preferences

### Design Guidelines
- Follow design_guidelines.md religiously for all UI implementations
- Use dark mode as primary (dark-first design)
- **Pure black/white monochrome color palette** - No vibrant colors except for destructive actions
- Maintain consistent spacing: micro (1-4), component (4-8), section (12-24)
- Implement 3D effects with perspective utilities and framer-motion animations
- Use glassmorphism effects (backdrop-blur, semi-transparent backgrounds)
- Ensure pixel-perfect responsive design across breakpoints

### Development Workflow
- Schema-first approach: Define data models before implementation
- Horizontal batching: Build complete layers across all features
- Frontend quality is paramount - exceptional visual design required
- Use Replit Auth for authentication
- PostgreSQL for data persistence
- Test all critical user journeys

## System Architecture

Portify is built with a modern web stack, featuring a React frontend and an Express.js backend. The platform leverages a schema-first approach and a design-first philosophy, prioritizing visual quality and robust data modeling.

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

**Design System:**
- Color Scheme: Pure black/white monochrome palette
  - Light mode: 0 0% 98% background, 0 0% 0% foreground/primary
  - Dark mode: 0 0% 0% background, 0 0% 98% foreground (default)
- Font: Inter (400, 500, 600, 700, 800)
- Dark mode first approach
- Consistent spacing using Tailwind scale
- 3D Effects: Custom perspective utilities (perspective-1000, preserve-3d, transform-gpu)
- Animations: Framer-motion with rotateX/Y, scale, and smooth transitions
- Glassmorphism: backdrop-blur with semi-transparent backgrounds (white/5, white/10)

### Database Schema

**Core Tables:**
- `users`: User accounts with `isAdmin` boolean for role-based access control.
- `sessions`: Stores user session data.
- `portfolios`: Stores user portfolio configurations.
- `templates`: Catalog of 1000+ portfolio templates.
- `projects`: Individual projects showcased within a portfolio.
- `social_links`: User's social media links associated with a portfolio.

**Relations:**
- A `User` can have multiple `Portfolios`.
- Each `Portfolio` is based on one `Template`.
- A `Portfolio` can contain multiple `Projects` and `Social Links`.

### API Routes

**Authentication:** `signup`, `signin`, `signout`, `get current user`.
**Portfolio Management:** `list`, `create`, `update` portfolios.
**Template Management:** `browse`, `get details`, `create` (admin only), `delete` (admin only), `update` (admin only).
**Content Management:** `list`, `add`, `delete` for projects and social links.
**AI Features:** `generate portfolio content`, `customize template` with AI.

### System Design Choices

- **Template Customization:** Dynamic content replacement using a `TemplateCustomizer` service for variables (e.g., `{{name}}`, `{{project.title}}`) and loop systems for projects and social links.
- **Admin System:** Role-based access control with an `isAdmin` flag, protected admin middleware, and a dedicated admin dashboard for template management (create, delete, update).
- **Deployment:** Configured for Vercel with `vercel.json` for build and routing, supporting server-side Express handling and static client bundle serving, adapting the server for serverless environments.
- **Security:** Admin-only template uploads, server-side validation, and authentication for protected routes.

## External Dependencies

- **Supabase:** Used for PostgreSQL database hosting and custom email/password authentication.
- **Drizzle ORM:** Object-Relational Mapper for interacting with the PostgreSQL database.
- **OpenAI GPT-5:** Integrated for AI-powered content generation and template customization features.
- **Vercel:** Deployment platform for hosting the application.
- **connect-pg-simple:** For database-backed session management.