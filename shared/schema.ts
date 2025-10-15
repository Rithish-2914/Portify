// Schema definitions for Portify - Portfolio Builder Platform
// Reference: blueprint:javascript_supabase

import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================================
// AUTH TABLES (Supabase handles auth.users, we just track session)
// ============================================================================

// Session storage table - for session management
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User profile table - synced with Supabase auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Matches Supabase auth.users.id
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// ============================================================================
// PORTFOLIO SYSTEM TABLES
// ============================================================================

// Template categories enum
export const templateCategories = [
  "minimal",
  "3d",
  "animated", 
  "visual",
  "futuristic",
  "gamer",
  "startup",
  "designer",
] as const;

export type TemplateCategory = typeof templateCategories[number];

// Profession/user categories
export const professionCategories = [
  "developer",
  "designer",
  "gamer",
  "entrepreneur",
  "artist",
  "student",
  "creator",
  "other",
] as const;

export type ProfessionCategory = typeof professionCategories[number];

// Templates table - stores the 1000+ portfolio templates
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // minimal, 3d, animated, visual, futuristic
  description: text("description"),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  previewUrl: varchar("preview_url", { length: 500 }), // URL to live preview or demo
  htmlContent: text("html_content"), // Store template HTML if needed
  cssContent: text("css_content"), // Store template CSS if needed
  jsContent: text("js_content"), // Store template JS if needed
  isFeatured: boolean("is_featured").default(false),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
  usageCount: true,
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

// Portfolios table - user's portfolio data
export const portfolios = pgTable("portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  templateId: varchar("template_id").references(() => templates.id),
  
  // User profile data
  name: varchar("name", { length: 255 }).notNull(),
  tagline: varchar("tagline", { length: 500 }),
  bio: text("bio"),
  profession: varchar("profession", { length: 100 }), // developer, designer, gamer, etc.
  profilePhotoUrl: varchar("profile_photo_url", { length: 500 }),
  
  // Publishing data
  subdomain: varchar("subdomain", { length: 100 }).unique(), // username.portify.io
  customDomain: varchar("custom_domain", { length: 255 }),
  isPublished: boolean("is_published").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolios.$inferSelect;

// Projects table - showcase projects in portfolio
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id, { onDelete: 'cascade' }),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }),
  projectUrl: varchar("project_url", { length: 500 }),
  tags: text("tags").array(), // Skills/technologies used
  displayOrder: integer("display_order").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Social links table - user's social media profiles
export const socialLinks = pgTable("social_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id, { onDelete: 'cascade' }),
  
  platform: varchar("platform", { length: 50 }).notNull(), // github, twitter, linkedin, etc.
  url: varchar("url", { length: 500 }).notNull(),
  displayOrder: integer("display_order").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSocialLinkSchema = createInsertSchema(socialLinks).omit({
  id: true,
  createdAt: true,
});

export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
export type SocialLink = typeof socialLinks.$inferSelect;

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  portfolios: many(portfolios),
}));

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [portfolios.templateId],
    references: [templates.id],
  }),
  projects: many(projects),
  socialLinks: many(socialLinks),
}));

export const templatesRelations = relations(templates, ({ many }) => ({
  portfolios: many(portfolios),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [projects.portfolioId],
    references: [portfolios.id],
  }),
}));

export const socialLinksRelations = relations(socialLinks, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [socialLinks.portfolioId],
    references: [portfolios.id],
  }),
}));
