// API Routes for Portify
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./supabaseAuth";
import { generatePortfolioContent, customizeTemplate } from "./aiService";
import { 
  insertPortfolioSchema,
  insertProjectSchema,
  insertSocialLinkSchema,
  insertTemplateSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // ============================================================================
  // Auth middleware and routes
  // ============================================================================
  await setupAuth(app);

  // Get current user is handled in supabaseAuth.ts

  // ============================================================================
  // Portfolio routes
  // ============================================================================

  // Get user's portfolios (protected)
  app.get("/api/portfolios", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const portfolios = await storage.getUserPortfolios(userId);
      res.json(portfolios);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      res.status(500).json({ message: "Failed to fetch portfolios" });
    }
  });

  // Get single portfolio (protected)
  app.get("/api/portfolios/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const portfolio = await storage.getPortfolio(id);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      // Verify user owns this portfolio
      const userId = req.user.id;
      if (portfolio.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Create portfolio (protected)
  app.post("/api/portfolios", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Validate request body
      const validatedData = insertPortfolioSchema.parse(req.body);
      
      // Create portfolio with user ID
      const portfolio = await storage.createPortfolio({
        ...validatedData,
        userId,
      });

      // Increment template usage count if template selected
      if (portfolio.templateId) {
        await storage.incrementTemplateUsage(portfolio.templateId);
      }

      res.status(201).json(portfolio);
    } catch (error: any) {
      console.error("Error creating portfolio:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create portfolio" });
    }
  });

  // Update portfolio (protected)
  app.patch("/api/portfolios/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Verify user owns this portfolio
      const existingPortfolio = await storage.getPortfolio(id);
      if (!existingPortfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      if (existingPortfolio.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const portfolio = await storage.updatePortfolio(id, req.body);
      res.json(portfolio);
    } catch (error) {
      console.error("Error updating portfolio:", error);
      res.status(500).json({ message: "Failed to update portfolio" });
    }
  });

  // Delete portfolio (protected)
  app.delete("/api/portfolios/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Verify user owns this portfolio
      const portfolio = await storage.getPortfolio(id);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      if (portfolio.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deletePortfolio(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      res.status(500).json({ message: "Failed to delete portfolio" });
    }
  });

  // ============================================================================
  // Template routes
  // ============================================================================

  // Get all templates (public)
  app.get("/api/templates", async (req, res) => {
    try {
      const { category } = req.query;
      
      let templates;
      if (category && category !== 'all') {
        templates = await storage.getTemplatesByCategory(category as string);
      } else {
        templates = await storage.getAllTemplates();
      }
      
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Get single template (public)
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getTemplate(id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Create template (protected - admin only for production)
  app.post("/api/templates", async (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validatedData);
      res.status(201).json(template);
    } catch (error: any) {
      console.error("Error creating template:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  // ============================================================================
  // Project routes
  // ============================================================================

  // Get portfolio projects (protected)
  app.get("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const { portfolioId } = req.query;
      
      if (!portfolioId) {
        return res.status(400).json({ message: "portfolioId is required" });
      }

      // Verify user owns the portfolio
      const userId = req.user.id;
      const portfolio = await storage.getPortfolio(portfolioId as string);
      if (!portfolio || portfolio.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const projects = await storage.getPortfolioProjects(portfolioId as string);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Create project (protected)
  app.post("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertProjectSchema.parse(req.body);

      // Verify user owns the portfolio
      const portfolio = await storage.getPortfolio(validatedData.portfolioId);
      if (!portfolio || portfolio.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error: any) {
      console.error("Error creating project:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Update project (protected)
  app.patch("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Get project and verify ownership through portfolio
      const existingProjects = await storage.getPortfolioProjects(req.body.portfolioId);
      const existingProject = existingProjects.find(p => p.id === id);
      
      if (!existingProject) {
        return res.status(404).json({ message: "Project not found" });
      }

      const portfolio = await storage.getPortfolio(existingProject.portfolioId);
      if (!portfolio || portfolio.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const project = await storage.updateProject(id, req.body);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Delete project (protected)
  app.delete("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Note: We need to get all portfolios to find which one owns this project
      // In a real app, you might want to add a direct query for this
      const portfolios = await storage.getUserPortfolios(userId);
      
      let projectFound = false;
      for (const portfolio of portfolios) {
        const projects = await storage.getPortfolioProjects(portfolio.id);
        if (projects.some(p => p.id === id)) {
          projectFound = true;
          break;
        }
      }

      if (!projectFound) {
        return res.status(404).json({ message: "Project not found" });
      }

      await storage.deleteProject(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // ============================================================================
  // Social link routes
  // ============================================================================

  // Get portfolio social links (protected)
  app.get("/api/social-links", isAuthenticated, async (req: any, res) => {
    try {
      const { portfolioId } = req.query;
      
      if (!portfolioId) {
        return res.status(400).json({ message: "portfolioId is required" });
      }

      // Verify user owns the portfolio
      const userId = req.user.id;
      const portfolio = await storage.getPortfolio(portfolioId as string);
      if (!portfolio || portfolio.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const links = await storage.getPortfolioSocialLinks(portfolioId as string);
      res.json(links);
    } catch (error) {
      console.error("Error fetching social links:", error);
      res.status(500).json({ message: "Failed to fetch social links" });
    }
  });

  // Create social link (protected)
  app.post("/api/social-links", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertSocialLinkSchema.parse(req.body);

      // Verify user owns the portfolio
      const portfolio = await storage.getPortfolio(validatedData.portfolioId);
      if (!portfolio || portfolio.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const link = await storage.createSocialLink(validatedData);
      res.status(201).json(link);
    } catch (error: any) {
      console.error("Error creating social link:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create social link" });
    }
  });

  // Update social link (protected)
  app.patch("/api/social-links/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Get link and verify ownership through portfolio
      const existingLinks = await storage.getPortfolioSocialLinks(req.body.portfolioId);
      const existingLink = existingLinks.find(l => l.id === id);
      
      if (!existingLink) {
        return res.status(404).json({ message: "Social link not found" });
      }

      const portfolio = await storage.getPortfolio(existingLink.portfolioId);
      if (!portfolio || portfolio.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const link = await storage.updateSocialLink(id, req.body);
      res.json(link);
    } catch (error) {
      console.error("Error updating social link:", error);
      res.status(500).json({ message: "Failed to update social link" });
    }
  });

  // Delete social link (protected)
  app.delete("/api/social-links/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Note: Similar to projects, we need to find which portfolio owns this link
      const portfolios = await storage.getUserPortfolios(userId);
      
      let linkFound = false;
      for (const portfolio of portfolios) {
        const links = await storage.getPortfolioSocialLinks(portfolio.id);
        if (links.some(l => l.id === id)) {
          linkFound = true;
          break;
        }
      }

      if (!linkFound) {
        return res.status(404).json({ message: "Social link not found" });
      }

      await storage.deleteSocialLink(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting social link:", error);
      res.status(500).json({ message: "Failed to delete social link" });
    }
  });

  // ============================================================================
  // AI Routes (AI-powered portfolio customization)
  // ============================================================================

  // Generate portfolio content with AI (protected)
  app.post("/api/ai/generate-portfolio", isAuthenticated, async (req, res) => {
    try {
      const userInput = req.body;
      
      const generatedContent = await generatePortfolioContent(userInput);
      res.json(generatedContent);
    } catch (error: any) {
      console.error("Error generating portfolio content:", error);
      res.status(500).json({ message: error.message || "Failed to generate content" });
    }
  });

  // Customize template with user data (protected)
  app.post("/api/ai/customize-template", isAuthenticated, async (req, res) => {
    try {
      const { templateHtml, userData } = req.body;
      
      if (!templateHtml || !userData) {
        return res.status(400).json({ message: "Template HTML and user data are required" });
      }
      
      const customizedHtml = await customizeTemplate(templateHtml, userData);
      res.json({ customizedHtml });
    } catch (error: any) {
      console.error("Error customizing template:", error);
      res.status(500).json({ message: error.message || "Failed to customize template" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
