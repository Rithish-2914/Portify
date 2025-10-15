// Reference: javascript_log_in_with_replit and javascript_database blueprints
import {
  users,
  portfolios,
  templates,
  projects,
  socialLinks,
  type User,
  type UpsertUser,
  type Portfolio,
  type InsertPortfolio,
  type Template,
  type InsertTemplate,
  type Project,
  type InsertProject,
  type SocialLink,
  type InsertSocialLink,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT: Required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Portfolio operations
  getUserPortfolios(userId: string): Promise<Portfolio[]>;
  getPortfolio(id: string): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: string, data: Partial<Portfolio>): Promise<Portfolio>;
  deletePortfolio(id: string): Promise<void>;

  // Template operations
  getAllTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, data: Partial<Template>): Promise<Template>;
  deleteTemplate(id: string): Promise<void>;
  incrementTemplateUsage(id: string): Promise<void>;

  // Project operations
  getPortfolioProjects(portfolioId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, data: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Social link operations
  getPortfolioSocialLinks(portfolioId: string): Promise<SocialLink[]>;
  createSocialLink(link: InsertSocialLink): Promise<SocialLink>;
  updateSocialLink(id: string, data: Partial<SocialLink>): Promise<SocialLink>;
  deleteSocialLink(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // ============================================================================
  // User operations (Required for Replit Auth)
  // ============================================================================

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // ============================================================================
  // Portfolio operations
  // ============================================================================

  async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    return await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.userId, userId));
  }

  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.id, id));
    return portfolio;
  }

  async createPortfolio(portfolioData: InsertPortfolio): Promise<Portfolio> {
    const [portfolio] = await db
      .insert(portfolios)
      .values(portfolioData)
      .returning();
    return portfolio;
  }

  async updatePortfolio(id: string, data: Partial<Portfolio>): Promise<Portfolio> {
    const [portfolio] = await db
      .update(portfolios)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(portfolios.id, id))
      .returning();
    return portfolio;
  }

  async deletePortfolio(id: string): Promise<void> {
    await db.delete(portfolios).where(eq(portfolios.id, id));
  }

  // ============================================================================
  // Template operations
  // ============================================================================

  async getAllTemplates(): Promise<Template[]> {
    return await db.select().from(templates);
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db
      .select()
      .from(templates)
      .where(eq(templates.id, id));
    return template;
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return await db
      .select()
      .from(templates)
      .where(eq(templates.category, category));
  }

  async createTemplate(templateData: InsertTemplate): Promise<Template> {
    const [template] = await db
      .insert(templates)
      .values(templateData)
      .returning();
    return template;
  }

  async updateTemplate(id: string, data: Partial<Template>): Promise<Template> {
    const [template] = await db
      .update(templates)
      .set(data)
      .where(eq(templates.id, id))
      .returning();
    return template;
  }

  async deleteTemplate(id: string): Promise<void> {
    await db.delete(templates).where(eq(templates.id, id));
  }

  async incrementTemplateUsage(id: string): Promise<void> {
    await db
      .update(templates)
      .set({ usageCount: sql`${templates.usageCount} + 1` })
      .where(eq(templates.id, id));
  }

  // ============================================================================
  // Project operations
  // ============================================================================

  async getPortfolioProjects(portfolioId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.portfolioId, portfolioId))
      .orderBy(projects.displayOrder);
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(projectData)
      .returning();
    return project;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // ============================================================================
  // Social link operations
  // ============================================================================

  async getPortfolioSocialLinks(portfolioId: string): Promise<SocialLink[]> {
    return await db
      .select()
      .from(socialLinks)
      .where(eq(socialLinks.portfolioId, portfolioId))
      .orderBy(socialLinks.displayOrder);
  }

  async createSocialLink(linkData: InsertSocialLink): Promise<SocialLink> {
    const [link] = await db
      .insert(socialLinks)
      .values(linkData)
      .returning();
    return link;
  }

  async updateSocialLink(id: string, data: Partial<SocialLink>): Promise<SocialLink> {
    const [link] = await db
      .update(socialLinks)
      .set(data)
      .where(eq(socialLinks.id, id))
      .returning();
    return link;
  }

  async deleteSocialLink(id: string): Promise<void> {
    await db.delete(socialLinks).where(eq(socialLinks.id, id));
  }
}

export const storage = new DatabaseStorage();
