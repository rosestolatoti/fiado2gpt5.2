import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  login, 
  verifyToken, 
  logout, 
  updatePassword, 
  authenticateToken 
} from "./routes/auth";
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getStats 
} from "./routes/products";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Rotas de autenticação
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/verify", authenticateToken, verifyToken);
  app.put("/api/auth/password", authenticateToken, updatePassword);

  // Rotas de produtos
  app.get("/api/products", getProducts);
  app.get("/api/products/stats", authenticateToken, getStats);
  app.get("/api/products/:id", getProduct);
  app.post("/api/products", authenticateToken, createProduct);
  app.put("/api/products/:id", authenticateToken, updateProduct);
  app.delete("/api/products/:id", authenticateToken, deleteProduct);

  app.get("/api/settings", async (_req: Request, res: Response) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json({ success: true, data: settings });
    } catch (error) {
      res.status(500).json({ success: false, error: "Erro ao carregar configurações" });
    }
  });

  app.put("/api/settings", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { siteName, whatsappGroupUrl } = req.body || {};
      const updated = await storage.updateSiteSettings({
        siteName: siteName ?? undefined,
        whatsappGroupUrl: whatsappGroupUrl ?? undefined,
      });
      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: "Erro ao salvar configurações" });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return httpServer;
}
