import "dotenv/config";
import express from "express";
import { createServer } from "http";
import type { IncomingMessage, ServerResponse } from "http";
import { registerRoutes } from "../server/routes";

const app = express();
const httpServer = createServer(app);

app.use(
  express.json({
    limit: "10mb",
    verify: (req, _res, buf) => {
      (req as IncomingMessage & { rawBody?: unknown }).rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false, limit: "10mb" }));

const routesReady = registerRoutes(httpServer, app);

app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (res.headersSent) {
    return next(err);
  }

  return res.status(status).json({ message });
});

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await routesReady;
  app(req, res);
}
