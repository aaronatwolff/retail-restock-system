import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { registerRoutes } from "./routes";
import { log } from "./vite";
import { apiRouteProtection, requestLogger, errorHandler } from "./middleware";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Apply middleware for API route protection
app.use(apiRouteProtection);
app.use(requestLogger);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    log("Starting server initialization...");
    
    // Register routes FIRST, before Vite middleware
    const server = await registerRoutes(app);
    log("Routes registered successfully");
    
    // Test database connection first
    try {
      log("Testing database connection...");
      const { db } = await import("./db.js");
      await db.execute('SELECT 1');
      log("Database connection successful");
      
      // Verify storage is working with database
      const { storage } = await import("./storage.js");
      const { validateDatabaseSchema } = await import("./health-check.js");
      
      const users = await storage.getUsers();
      const venues = await storage.getVenues();
      const products = await storage.getProducts();
      
      log(`Database storage verified - ${users.length} users, ${venues.length} venues, ${products.length} products found`);
      
      // Validate schema integrity
      const schemaValid = await validateDatabaseSchema();
      if (schemaValid) {
        log("Database schema validation passed");
      } else {
        log("Database schema validation failed - some data may be missing", "warn");
      }
    } catch (dbError) {
      log(`Database connection failed: ${dbError}`, "error");
      // Fallback to memory storage for development
      log("Falling back to memory storage for development");
      const storageModule = await import("./storage.js");
      (storageModule as any).storage = new (await import("./storage.js")).MemStorage();
    }

    // Routes already registered above

    // Apply comprehensive error handling
    app.use(errorHandler);

    // Skip Vite setup to serve HTML application directly

    // Serve static files directly from client/public (after routes)
    log("Setting up static file serving...");
    app.use(express.static(path.resolve(process.cwd(), 'client/public'), {
      setHeaders: (res, path) => {
        // Set iframe-friendly headers for all static files
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('Content-Security-Policy', 'frame-ancestors *; default-src * data: blob: filesystem: about: ws: wss: \'unsafe-inline\' \'unsafe-eval\'; script-src * data: blob: \'unsafe-inline\' \'unsafe-eval\'; connect-src * data: blob: \'unsafe-inline\'; img-src * data: blob: \'unsafe-inline\'; frame-src * data: blob:; style-src * data: blob: \'unsafe-inline\'; font-src * data: blob:');
        res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
        res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
        res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
      }
    }));
    
    // Handle React/Vite requests that shouldn't exist in static setup
    app.get('/@*', (req, res) => {
      res.status(404).end();
    });
    
    app.get('/src/*', (req, res) => {
      res.status(404).end();
    });
    
    // Standard 404 for any other missing routes
    app.get('*', (req, res) => {
      console.log(`404 route: ${req.path}`);
      res.status(404).send(`
<!DOCTYPE html>
<html>
<head><title>Page Not Found</title></head>
<body style="background:#6c757d;color:white;padding:50px;text-align:center;font-family:Arial;">
  <h1>Page Not Found</h1>
  <p>Route: ${req.path}</p>
  <p><a href="/" style="color:white;">Return to Home</a></p>
</body>
</html>
      `);
    });

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    log(`Starting server on port ${port}...`);
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    log(`Failed to start server: ${error}`, "error");
    console.error(error);
    process.exit(1);
  }
})();
