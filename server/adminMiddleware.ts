// Admin Role Middleware
import type { RequestHandler } from "express";

/**
 * Middleware to check if user is an admin
 * Must be used after isAuthenticated middleware
 */
export const isAdmin: RequestHandler = (req: any, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};
