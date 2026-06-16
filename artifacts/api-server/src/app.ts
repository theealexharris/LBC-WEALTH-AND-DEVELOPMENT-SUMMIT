import express, { type Express, type Request } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Security headers — X-Frame-Options, X-Content-Type-Options, HSTS, etc.
app.use(helmet({ contentSecurityPolicy: false }));

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

const allowedOrigin = process.env["FRONTEND_URL"] ?? "https://lbc-wealth-and-development-summit.onrender.com";
app.use(
  cors({
    origin: process.env["NODE_ENV"] === "production" ? allowedOrigin : true,
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Parse JSON — save raw body so the Stripe webhook handler can verify signatures
app.use(
  express.json({
    verify: (_req: Request, _res, buf) => {
      (_req as Request & { rawBody?: Buffer }).rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve the built frontend static files in production
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.resolve(__dirname, "../../lbc-summit/dist/public");

if (existsSync(staticDir)) {
  app.use(express.static(staticDir));
  // SPA fallback — serve index.html for any non-API route
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

export default app;
