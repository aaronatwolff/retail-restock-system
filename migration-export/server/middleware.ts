// Middleware to ensure API route integrity and prevent routing conflicts
import type { Request, Response, NextFunction } from "express";

export function apiRouteProtection(req: Request, res: Response, next: NextFunction) {
  // Ensure API routes always return JSON and are not intercepted
  if (req.path.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    
    // Add CORS headers for API routes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  }
  
  next();
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const originalSend = res.json;
  
  res.json = function(body) {
    const duration = Date.now() - start;
    
    if (req.path.startsWith('/api/')) {
      console.log(`API ${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
      
      // Log response size for debugging
      const responseSize = JSON.stringify(body).length;
      if (responseSize > 10000) {
        console.log(`Large response: ${responseSize} bytes`);
      }
    }
    
    return originalSend.call(this, body);
  };
  
  next();
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Request error:', {
    path: req.path,
    method: req.method,
    error: err.message,
    stack: err.stack
  });
  
  // Always return JSON for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
      path: req.path,
      timestamp: new Date().toISOString()
    });
  }
  
  next(err);
}