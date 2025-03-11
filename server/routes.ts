import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { calculateStatistics } from "@shared/abortionData";
import { Region, LegalStatus, DataView } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for abortion statistics
  const apiRouter = express.Router();
  
  // Get all abortion statistics
  apiRouter.get("/abortion-stats", async (_req: Request, res: Response) => {
    try {
      const stats = await storage.getAllAbortionStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch abortion statistics" });
    }
  });

  // Get filtered abortion statistics
  apiRouter.get("/abortion-stats/filtered", async (req: Request, res: Response) => {
    try {
      const regionSchema = z.nativeEnum(Region).optional().default(Region.ALL);
      const legalStatusSchema = z.nativeEnum(LegalStatus).optional().default(LegalStatus.ALL);
      const dataViewSchema = z.nativeEnum(DataView).optional().default(DataView.TOTAL);
      const searchTermSchema = z.string().optional().default("");

      const region = regionSchema.parse(req.query.region);
      const legalStatus = legalStatusSchema.parse(req.query.legalStatus);
      const dataView = dataViewSchema.parse(req.query.dataView);
      const searchTerm = searchTermSchema.parse(req.query.searchTerm);

      const stats = await storage.getFilteredAbortionStats(
        region,
        legalStatus,
        dataView,
        searchTerm
      );
      
      res.json(stats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to fetch filtered abortion statistics" });
      }
    }
  });

  // Get overall summary statistics - must be placed before the :stateId route to avoid being caught by it
  apiRouter.get("/abortion-stats/summary", async (_req: Request, res: Response) => {
    try {
      const stats = calculateStatistics();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate summary statistics" });
    }
  });
  
  // Get abortion statistics by state ID
  apiRouter.get("/abortion-stats/:stateId", async (req: Request, res: Response) => {
    try {
      const stateId = req.params.stateId;
      const stat = await storage.getAbortionStatById(stateId);
      
      if (!stat) {
        return res.status(404).json({ error: "State not found" });
      }
      
      res.json(stat);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch state abortion statistics" });
    }
  });

  // Mount API routes
  app.use("/api", apiRouter);

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}

// Import express from the top level module since we're using it in the function
import express from "express";
