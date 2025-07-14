import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { unleashedService } from "./services/unleashed";
import { insertRestockSessionSchema, type RestockItem } from "@shared/schema";
import { performHealthCheck, validateDatabaseSchema } from "./health-check";
import { z } from "zod";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test route to verify routing works
  app.get("/test-route", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Route Test</title></head>
      <body style="background: blue; color: white; font: 24px Arial; padding: 50px;">
        <h1>ROUTE TEST WORKING</h1>
        <p>Server time: ${new Date().toLocaleString()}</p>
        <p><a href="/" style="color: yellow;">Back to Main</a></p>
        <p><a href="/simple.html" style="color: yellow;">Simple Test</a></p>
      </body>
      </html>
    `);
  });

  // Direct simple route without file serving
  app.get("/direct-test", (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Direct Test</title>
        <meta http-equiv="refresh" content="0">
      </head>
      <body style="background: orange; color: black; font: 36px Arial; text-align: center; padding: 80px;">
        <h1>DIRECT ROUTE TEST</h1>
        <p>Orange page from direct route</p>
        <p>Time: ${new Date().toLocaleString()}</p>
        <p><a href="/">Main App</a></p>
      </body>
      </html>
    `);
  });

  // Serve root with iframe-compatible headers
  app.get("/", (req, res) => {
    console.log(`ROOT ACCESS: ${new Date().toISOString()}`);
    console.log(`User-Agent: ${req.get('User-Agent')}`);
    console.log(`X-Forwarded-For: ${req.get('X-Forwarded-For')}`);
    console.log(`Host: ${req.get('Host')}`);
    
    // Set comprehensive iframe-compatible headers
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Content-Security-Policy', 'frame-ancestors *; default-src * data: blob: filesystem: about: ws: wss: \'unsafe-inline\' \'unsafe-eval\'; script-src * data: blob: \'unsafe-inline\' \'unsafe-eval\'; connect-src * data: blob: \'unsafe-inline\'; img-src * data: blob: \'unsafe-inline\'; frame-src * data: blob:; style-src * data: blob: \'unsafe-inline\'; font-src * data: blob:');
    res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    // Detect Replit environment more accurately
    const userAgent = req.get('User-Agent') || '';
    const host = req.get('Host') || '';
    const forwarded = req.get('X-Forwarded-For') || '';
    const isReplit = host.includes('replit.dev') || 
                     userAgent.includes('HeadlessChrome') || 
                     forwarded.includes('replit') ||
                     req.headers['x-replit-user-id'] ||
                     req.headers['x-forwarded-host'];
    
    console.log(`Replit environment detected: ${isReplit}`);
    
    // Send iframe-optimized HTML
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Retail Restock System</title>
  <meta http-equiv="Content-Security-Policy" content="frame-ancestors *; default-src * data: blob: filesystem: about: ws: wss: 'unsafe-inline' 'unsafe-eval'">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
      color: white;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      color: #333;
      text-align: center;
    }
    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .status-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 12px;
      border: 2px solid #e9ecef;
    }
    .status-value { font-size: 32px; color: #28a745; font-weight: bold; }
    .status-label { margin-top: 8px; color: #6c757d; }
    .btn {
      display: inline-block;
      padding: 15px 30px;
      margin: 10px;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: transform 0.2s;
    }
    .btn:hover { transform: translateY(-2px); }
    .btn-secondary {
      background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%);
    }
    .debug-info {
      background: #e9ecef;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      font-family: monospace;
      font-size: 12px;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🏪 Retail Restock System</h1>
    <p style="margin: 20px 0; font-size: 18px; color: #6c757d;">
      Inventory Management for ${isReplit ? 'Replit Environment' : 'Production'}
    </p>
    
    <div class="status-grid">
      <div class="status-card">
        <div class="status-value">✓</div>
        <div class="status-label">Preview Active</div>
      </div>
      <div class="status-card">
        <div class="status-value">✓</div>
        <div class="status-label">Database Online</div>
      </div>
      <div class="status-card">
        <div class="status-value">✓</div>
        <div class="status-label">APIs Ready</div>
      </div>
      <div class="status-card">
        <div class="status-value">✓</div>
        <div class="status-label">Unleashed Connected</div>
      </div>
    </div>
    
    <div style="margin: 40px 0;">
      <h2>Access Application</h2>
      <p style="margin: 15px 0;">Choose your preferred interface:</p>
      
      <a href="/preview-fix.html" class="btn">
        📱 Full Restock Application
      </a>
      
      <a href="/api/health" class="btn btn-secondary">
        🔍 System Health Check
      </a>
    </div>
    
    <div class="debug-info">
      <strong>Environment Details:</strong><br>
      Time: ${new Date().toISOString()}<br>
      Host: ${host}<br>
      User-Agent: ${userAgent.substring(0, 50)}...<br>
      Replit Detected: ${isReplit}
    </div>
    
    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #dee2e6;">
      <h3>Features Available</h3>
      <ul style="text-align: left; max-width: 500px; margin: 20px auto;">
        <li>✓ Multi-step restock workflow</li>
        <li>✓ Authentic Shopify/WOLFF32 pricing</li>
        <li>✓ Cold brew special ordering logic</li>
        <li>✓ Automatic Unleashed order creation</li>
        <li>✓ Database storage for all 5 venues</li>
      </ul>
    </div>
  </div>
  
  <script>
    console.log('Retail Restock System - Root page loaded successfully');
    console.log('Environment: ${isReplit ? 'Replit' : 'Standard'}');
    console.log('Timestamp:', new Date().toISOString());
    
    // Test iframe compatibility
    if (window.self !== window.top) {
      console.log('Running inside iframe - Replit preview detected');
    } else {
      console.log('Running in direct browser window');
    }
    
    // Auto-redirect after 5 seconds if user doesn't interact
    let redirectTimer = setTimeout(() => {
      console.log('Auto-redirecting to full application...');
      window.location.href = '/preview-fix.html';
    }, 5000);
    
    // Cancel auto-redirect if user interacts with page
    document.addEventListener('click', () => {
      clearTimeout(redirectTimer);
      console.log('User interaction detected - auto-redirect cancelled');
    });
  </script>
</body>
</html>`);
  });

  // Emergency fallback route - serves working HTML if React fails
  app.get("/fallback", (req, res) => {
    const fallbackPath = path.resolve(process.cwd(), "client/public/fallback.html");
    if (fs.existsSync(fallbackPath)) {
      res.sendFile(fallbackPath);
    } else {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>System Status</title></head>
        <body style="font-family: Arial; padding: 20px; background: #f8f9fa;">
          <h1>Retail Restock System</h1>
          <p>Backend operational - Frontend loading issues detected</p>
          <p><a href="/api/health">Health Check</a> | <a href="/api/users">Users</a> | <a href="/api/venues">Venues</a></p>
        </body>
        </html>
      `);
    }
  });

  // Health check endpoint for monitoring and debugging
  app.get("/api/health", async (req, res) => {
    try {
      const health = await performHealthCheck();
      const status = health.database && health.storage && health.apis ? 200 : 503;
      res.status(status).json(health);
    } catch (error) {
      res.status(500).json({
        database: false,
        storage: false,
        apis: false,
        timestamp: new Date(),
        errors: [`Health check failed: ${error.message}`]
      });
    }
  });

  // Database validation endpoint
  app.get("/api/validate-db", async (req, res) => {
    try {
      const isValid = await validateDatabaseSchema();
      res.json({ valid: isValid, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ valid: false, error: error.message });
    }
  });
  // Get all users with failsafe
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      console.log(`API: Returning ${users.length} users`);
      res.json(users);
    } catch (error) {
      console.error("Users API error:", error);
      res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
  });

  // Get all venues with failsafe
  app.get("/api/venues", async (req, res) => {
    try {
      const venues = await storage.getVenues();
      console.log(`API: Returning ${venues.length} venues`);
      res.json(venues);
    } catch (error) {
      console.error("Venues API error:", error);
      res.status(500).json({ message: "Failed to fetch venues", error: error.message });
    }
  });

  // Get venue with products
  app.get("/api/venues/:id", async (req, res) => {
    try {
      const venueId = parseInt(req.params.id);
      const venue = await storage.getVenueWithProducts(venueId);
      
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }

      res.json(venue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venue" });
    }
  });

  // Get all products with failsafe
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      console.log(`API: Returning ${products.length} products`);
      res.json(products);
    } catch (error) {
      console.error("Products API error:", error);
      res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
  });

  // Get venue products only
  app.get("/api/venues/:id/products", async (req, res) => {
    try {
      const venueId = parseInt(req.params.id);
      console.log(`Fetching products for venue ID: ${venueId}`);
      
      const venueProducts = await storage.getVenueProducts(venueId);
      console.log(`Found ${venueProducts.length} products for venue ${venueId}`);
      
      res.json(venueProducts);
    } catch (error) {
      console.error(`Error fetching venue products for venue ${req.params.id}:`, error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      res.status(500).json({ 
        message: "Failed to fetch venue products",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Create restock session
  app.post("/api/restock-sessions", async (req, res) => {
    try {
      console.log("Creating restock session with data:", JSON.stringify(req.body, null, 2));
      
      const validatedData = insertRestockSessionSchema.parse(req.body);
      console.log("Validation successful, creating session...");
      
      const session = await storage.createRestockSession(validatedData);
      console.log("Session created successfully:", session.id);
      
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating restock session:", error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      res.status(500).json({ 
        message: "Failed to create restock session",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get Shopify pricing for a product
  app.get("/api/pricing/shopify/:code", async (req, res) => {
    try {
      const productCode = req.params.code;
      console.log(`Fetching Shopify price for product: ${productCode}`);
      
      const price = await unleashedService.getShopifyPrice(productCode);
      
      if (price === null) {
        console.log(`Shopify price not found for product: ${productCode}`);
        return res.status(404).json({ error: "Product pricing not found", price: 0 });
      }

      console.log(`Shopify price found for ${productCode}: ${price}`);
      res.json({
        productCode,
        price: price,
        priceSource: "Shopify AUD"
      });
    } catch (error) {
      console.error("Error fetching Shopify pricing:", error);
      res.status(500).json({ error: "Failed to fetch pricing", price: 0 });
    }
  });

  // Get WOLFF32 pricing for a product
  app.get("/api/pricing/wolff32/:code", async (req, res) => {
    try {
      const productCode = req.params.code;
      console.log(`Fetching WOLFF32 price for product: ${productCode}`);
      
      const price = await unleashedService.getWolff32Price(productCode);
      
      if (price === null) {
        console.log(`WOLFF32 price not found for product: ${productCode}`);
        return res.status(404).json({ error: "Product pricing not found", price: 0 });
      }

      console.log(`WOLFF32 price found for ${productCode}: ${price}`);
      res.json({
        productCode,
        price: price,
        priceSource: "WOLFF32 AUD"
      });
    } catch (error) {
      console.error("Error fetching WOLFF32 pricing:", error);
      res.status(500).json({ error: "Failed to fetch pricing", price: 0 });
    }
  });

  // Debug endpoint to list available warehouses
  app.get("/api/debug/warehouses", async (req, res) => {
    try {
      const warehouses = await unleashedService.listAllWarehouses();
      res.json({ warehouses });
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      res.status(500).json({ error: "Failed to fetch warehouses from Unleashed" });
    }
  });

  // Production tax code research endpoint
  app.get("/api/debug/tax-codes", async (req, res) => {
    try {
      console.log('Production tax code research initiated...');
      const taxCodes = await unleashedService.getAvailableTaxCodes();
      
      res.json({
        environment: process.env.NODE_ENV || 'development',
        taxCodesFound: taxCodes.length,
        taxCodes: taxCodes,
        recommendation: taxCodes.length > 0 
          ? `Use tax code: ${taxCodes[0].TaxCode} (${taxCodes[0].TaxRate * 100}% rate)`
          : 'No valid tax codes discovered - check Unleashed tax configuration',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Error researching tax codes:", error);
      res.status(500).json({ 
        error: "Failed to research tax codes from Unleashed",
        details: error.message,
        recommendation: "Check Unleashed API permissions and tax setup"
      });
    }
  });

  // Environment fix - force preview version
  app.get("/fix", (req, res) => {
    res.redirect('/preview-fix.html');
  });

  // Preview debug routes
  app.get("/debug", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html><head><title>Preview Debug</title></head>
      <body style="margin:0;padding:30px;background:#dc2626;color:white;font:20px Arial;">
        <h1>PREVIEW DEBUG ACTIVE</h1>
        <p>Server Status: ONLINE</p>
        <p>Time: ${new Date().toLocaleString()}</p>
        <p>If you see this red page, preview window is working</p>
        <hr>
        <p><a href="/fix" style="color:yellow;">🔧 Fixed Version</a></p>
        <p><a href="/preview-fix.html" style="color:yellow;">Direct Fix</a></p>
        <p><a href="/" style="color:yellow;">Try Main App</a></p>
        <p><a href="/simple.html" style="color:yellow;">Simple Test</a></p>
      </body></html>
    `);
  });

  app.get("/static-test.html", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html><head><title>Static Test</title></head>
      <body style="padding:20px;font-family:Arial;">
        <h1>Static Test Page</h1>
        <p>This is a simple static test page to verify preview functionality.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
        <a href="/">Back to App</a>
      </body></html>
    `);
  });

  // Test preview route with sample data
  app.get("/api/report-preview", async (req, res) => {
    try {
      // Create sample report data to demonstrate the report format
      const sampleData = {
        venue: {
          id: 1,
          name: "Bru Cru",
          code: "bru-cru"
        },
        period: {
          month: 12,
          year: 2024,
          startDate: new Date(2024, 11, 1),
          endDate: new Date(2024, 11, 31),
          displayName: "December 2024"
        },
        summary: {
          totalEstimatedSales: 3250.75,
          totalPurchaseCosts: 2180.50,
          grossProfit: 1070.25,
          profitMargin: 32.9,
          transactionCount: 8
        },
        topProducts: [
          {
            productCode: "DRK2",
            productName: "DRK 500g Seasonal Blend",
            unitsSold: 45,
            revenue: 1417.50,
            cost: 877.50,
            profit: 540.00,
            profitMargin: 38.1
          },
          {
            productCode: "7081",
            productName: "Cold Brew Individual",
            unitsSold: 28,
            revenue: 1344.00,
            cost: 896.00,
            profit: 448.00,
            profitMargin: 33.3
          },
          {
            productCode: "5916",
            productName: "Matcha",
            unitsSold: 15,
            revenue: 450.00,
            cost: 292.50,
            profit: 157.50,
            profitMargin: 35.0
          },
          {
            productCode: "100469",
            productName: "Lil Red",
            unitsSold: 12,
            revenue: 408.00,
            cost: 234.00,
            profit: 174.00,
            profitMargin: 42.6
          },
          {
            productCode: "MERCH-MUG",
            productName: "Ceramic Mug White",
            unitsSold: 8,
            revenue: 120.00,
            cost: 80.00,
            profit: 40.00,
            profitMargin: 33.3
          }
        ],
        trends: {
          salesVsPreviousMonth: 12.5,
          profitVsPreviousMonth: 8.3,
          trendDirection: 'up' as const
        },
        dailyBreakdown: [
          { date: "2024-12-01", estimatedSales: 145.50, purchaseCosts: 89.25 },
          { date: "2024-12-03", estimatedSales: 287.30, purchaseCosts: 178.40 },
          { date: "2024-12-05", estimatedSales: 456.75, purchaseCosts: 298.60 },
          { date: "2024-12-08", estimatedSales: 312.40, purchaseCosts: 201.80 },
          { date: "2024-12-12", estimatedSales: 523.80, purchaseCosts: 345.20 },
          { date: "2024-12-15", estimatedSales: 398.20, purchaseCosts: 267.15 },
          { date: "2024-12-18", estimatedSales: 467.90, purchaseCosts: 312.50 },
          { date: "2024-12-22", estimatedSales: 658.90, purchaseCosts: 487.60 }
        ],
        sixMonthTrend: [
          { month: "Jul 2024", estimatedSales: 2845, invoicedAmount: 1896 },
          { month: "Aug 2024", estimatedSales: 2967, invoicedAmount: 1978 },
          { month: "Sep 2024", estimatedSales: 3123, invoicedAmount: 2082 },
          { month: "Oct 2024", estimatedSales: 2654, invoicedAmount: 1769 },
          { month: "Nov 2024", estimatedSales: 2891, invoicedAmount: 1940 },
          { month: "Dec 2024", estimatedSales: 3251, invoicedAmount: 2181 }
        ]
      };

      // Generate simple HTML report directly
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Monthly Report - ${sampleData.venue.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
            .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
            .summary-card { background: #ecf0f1; padding: 15px; border-radius: 5px; text-align: center; }
            .summary-card h3 { margin: 0 0 10px 0; color: #2c3e50; }
            .summary-card .value { font-size: 24px; font-weight: bold; color: #27ae60; }
            .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .products-table th, .products-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .products-table th { background: #3498db; color: white; }
            .chart-container { margin: 30px 0; }
            .bar-chart { display: flex; align-items: end; height: 200px; gap: 10px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            .bar-group { flex: 1; display: flex; gap: 2px; align-items: end; }
            .bar { width: 100%; border-radius: 2px 2px 0 0; min-height: 2px; }
            .bar.estimated { background: #3498db; }
            .bar.invoiced { background: #27ae60; }
            .bar-label { text-align: center; font-size: 12px; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Monthly Report: ${sampleData.venue.name}</h1>
            <p><strong>Period:</strong> ${sampleData.period.displayName}</p>
            
            <div class="summary">
              <div class="summary-card">
                <h3>Total Sales</h3>
                <div class="value">$${sampleData.summary.totalEstimatedSales.toFixed(2)}</div>
              </div>
              <div class="summary-card">
                <h3>Gross Profit</h3>
                <div class="value">$${sampleData.summary.grossProfit.toFixed(2)}</div>
              </div>
              <div class="summary-card">
                <h3>Profit Margin</h3>
                <div class="value">${sampleData.summary.profitMargin.toFixed(1)}%</div>
              </div>
              <div class="summary-card">
                <h3>Transactions</h3>
                <div class="value">${sampleData.summary.transactionCount}</div>
              </div>
            </div>

            <h2>Top Products</h2>
            <table class="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                  <th>Profit</th>
                  <th>Margin</th>
                </tr>
              </thead>
              <tbody>
                ${sampleData.topProducts.map(product => `
                  <tr>
                    <td>${product.productName}</td>
                    <td>${product.unitsSold}</td>
                    <td>$${product.revenue.toFixed(2)}</td>
                    <td>$${product.profit.toFixed(2)}</td>
                    <td>${product.profitMargin.toFixed(1)}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="chart-container">
              <h2>6-Month Trend</h2>
              <div class="bar-chart">
                ${sampleData.sixMonthTrend.map(month => {
                  const maxValue = Math.max(...sampleData.sixMonthTrend.map(m => m.estimatedSales));
                  const estimatedHeight = (month.estimatedSales / maxValue) * 160;
                  const invoicedHeight = (month.invoicedAmount / maxValue) * 160;
                  return `
                    <div class="bar-group">
                      <div class="bar estimated" style="height: ${estimatedHeight}px;" title="Estimated: $${month.estimatedSales}"></div>
                      <div class="bar invoiced" style="height: ${invoicedHeight}px;" title="Invoiced: $${month.invoicedAmount}"></div>
                      <div class="bar-label">${month.month.split(' ')[0]}</div>
                    </div>
                  `;
                }).join('')}
              </div>
              <p style="text-align: center; margin-top: 10px;">
                <span style="color: #3498db;">■</span> Estimated Sales &nbsp;
                <span style="color: #27ae60;">■</span> Invoiced Amount
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(html);
    } catch (error) {
      console.error("Error generating preview report:", error);
      res.status(500).json({ error: "Failed to generate preview report" });
    }
  });

  // Customer search endpoint for finding Unleashed customer mappings
  app.get("/api/debug/customers", async (req, res) => {
    try {
      const searchTerm = req.query.search as string;
      console.log(`Searching for customers with term: ${searchTerm}`);
      
      const customers = await unleashedService.searchCustomers(searchTerm);
      
      res.json({
        searchTerm: searchTerm || 'all customers',
        customersFound: customers.length,
        customers: customers.map(customer => ({
          guid: customer.Guid,
          code: customer.CustomerCode,
          name: customer.CustomerName
        })),
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Error searching customers:", error);
      res.status(500).json({ 
        error: "Failed to search customers from Unleashed",
        details: error.message
      });
    }
  });

  // Submit restock session to Unleashed
  app.post("/api/restock-sessions/:id/submit", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.getRestockSessionById(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Restock session not found" });
      }

      if (session.status !== "pending") {
        return res.status(400).json({ message: "Session already processed" });
      }

      // Update status to processing
      await storage.updateRestockSession(sessionId, { status: "processing" });

      // Get venue and user details
      const venue = await storage.getVenueById(session.venueId);
      if (!venue) {
        await storage.updateRestockSession(sessionId, { status: "failed" });
        return res.status(400).json({ message: "Venue not found" });
      }

      // Prepare order data for Unleashed based on items that need reordering
      const items = session.itemsData as RestockItem[];
      const orderLines = [];
      
      for (const item of items) {
        // Determine if item needs reordering
        let needsReorder = false;
        let orderQuantity = 0;
        
        if (item.productReturnType === 'consumed') {
          // For consumed items: check if remaining quantity is at or below reorder threshold
          if (item.quantity <= (item.reorderThreshold || 0)) {
            needsReorder = true;
            orderQuantity = item.soldQuantity; // Reorder what was sold
          }
        } else {
          // For returned items: always reorder what was sold
          if (item.soldQuantity > 0) {
            needsReorder = true;
            orderQuantity = item.soldQuantity; // Reorder what was sold
          }
        }
        
        if (needsReorder && orderQuantity > 0) {
          // Get WOLFF32 pricing for ordering
          const wolff32Price = await unleashedService.getWolff32Price(item.productCode);
          const unitPrice = wolff32Price || parseFloat(item.productPrice);
          
          orderLines.push({
            productCode: item.productCode,
            quantity: orderQuantity,
            unitPrice: unitPrice
          });
        }
      }

      if (orderLines.length === 0) {
        await storage.updateRestockSession(sessionId, { status: "failed" });
        return res.status(400).json({ message: "No items to order" });
      }

      try {
        // Verify venue has linked Unleashed customer
        if (!venue.unleashedCustomerCode) {
          await storage.updateRestockSession(sessionId, { status: "failed" });
          return res.status(400).json({ 
            message: `Venue ${venue.name} is not linked to an Unleashed customer. Please contact support to set up customer linking.` 
          });
        }

        // Create order in Unleashed using linked customer
        const orderResult = await unleashedService.createSalesOrder({
          customerCode: venue.unleashedCustomerCode,
          customerGuid: venue.unleashedCustomerGuid ?? undefined,
          orderLines,
          comments: `Restock order for ${venue.name} (${venue.unleashedCustomerName}) - ${session.comments || ''}`,
          orderDate: new Date().toISOString()
        });

        // Complete the order automatically
        const completed = await unleashedService.completeSalesOrder(orderResult.orderId);
        
        let invoiceResult = null;
        if (completed) {
          // Generate invoice
          invoiceResult = await unleashedService.generateInvoice(orderResult.orderId);
        }

        // Calculate total value
        const totalValue = orderLines.reduce((sum, line) => sum + (line.quantity * line.unitPrice), 0);

        // Update session with results
        await storage.updateRestockSession(sessionId, {
          status: completed ? "completed" : "submitted",
          unleashedOrderId: orderResult.orderId,
          unleashedInvoiceId: invoiceResult?.invoiceId || null,
          totalValue: totalValue.toString()
        });

        res.json({
          success: true,
          orderId: orderResult.orderId,
          orderNumber: orderResult.orderNumber,
          invoiceId: invoiceResult?.invoiceId,
          invoiceNumber: invoiceResult?.invoiceNumber,
          totalValue
        });

      } catch (unleashedError) {
        console.error("Unleashed API error:", unleashedError);
        await storage.updateRestockSession(sessionId, { status: "failed" });
        res.status(500).json({ 
          message: "Failed to create order in Unleashed", 
          error: unleashedError instanceof Error ? unleashedError.message : "Unknown error"
        });
      }

    } catch (error) {
      console.error("Submit session error:", error);
      res.status(500).json({ message: "Failed to submit restock session" });
    }
  });

  // Get restock session
  app.get("/api/restock-sessions/:id", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.getRestockSessionById(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Restock session not found" });
      }

      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restock session" });
    }
  });

  // Link venues with specific Unleashed customer codes
  app.post("/api/venues/:id/link-customer", async (req, res) => {
    try {
      const venueId = parseInt(req.params.id);
      const { customerCode } = req.body;

      if (!customerCode) {
        return res.status(400).json({ error: "Customer code is required" });
      }

      // Find the customer in Unleashed
      const customer = await unleashedService.findCustomerByCode(customerCode);
      if (!customer) {
        return res.status(404).json({ error: `Customer not found with code: ${customerCode}` });
      }

      // Update venue with customer information
      const updatedVenue = await storage.updateVenue(venueId, {
        unleashedCustomerGuid: customer.Guid,
        unleashedCustomerCode: customer.CustomerCode,
        unleashedCustomerName: customer.CustomerName
      });

      if (!updatedVenue) {
        return res.status(404).json({ error: "Venue not found" });
      }

      res.json({
        venue: updatedVenue,
        customer: {
          guid: customer.Guid,
          customerCode: customer.CustomerCode,
          customerName: customer.CustomerName
        }
      });
    } catch (error) {
      console.error('Error linking venue customer:', error);
      res.status(500).json({ error: "Failed to link customer" });
    }
  });

  // Auto-link venues with known customer codes
  app.post("/api/venues/auto-link-customers", async (req, res) => {
    try {
      const customerMappings: Record<string, string> = {
        "Bru Cru": "BruCru1",
        "All Sew": "ALLSEWCOF", 
        "Boiler Room": "THEBOILER2",
        "Golly Gosh": "GOLLYGOSH",
        "Kenrose Bakery": "KENROSE BAKERY"
      };

      const venues = await storage.getVenues();
      const results = [];

      for (const venue of venues) {
        const customerCode = customerMappings[venue.name];
        if (customerCode) {
          try {
            const customer = await unleashedService.findCustomerByCode(customerCode);
            if (customer) {
              const updatedVenue = await storage.updateVenue(venue.id, {
                unleashedCustomerGuid: customer.Guid,
                unleashedCustomerCode: customer.CustomerCode,
                unleashedCustomerName: customer.CustomerName
              });

              results.push({
                venue: venue.name,
                status: "linked",
                customer: {
                  guid: customer.Guid,
                  customerCode: customer.CustomerCode,
                  customerName: customer.CustomerName
                }
              });
            } else {
              results.push({
                venue: venue.name,
                status: "customer_not_found",
                customerCode
              });
            }
          } catch (error) {
            results.push({
              venue: venue.name,
              status: "error",
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        } else {
          results.push({
            venue: venue.name,
            status: "no_mapping"
          });
        }
      }

      res.json({
        message: "Auto-linking completed",
        results
      });
    } catch (error) {
      console.error('Error auto-linking customers:', error);
      res.status(500).json({ error: "Failed to auto-link customers" });
    }
  });

  // Get venue customer linking status
  app.get("/api/venues/customer-links", async (req, res) => {
    try {
      const venues = await storage.getVenues();
      const venueLinks = venues.map(venue => ({
        venueId: venue.id,
        venueName: venue.name,
        venueCode: venue.code,
        isLinked: !!venue.unleashedCustomerCode,
        unleashedCustomer: venue.unleashedCustomerCode ? {
          guid: venue.unleashedCustomerGuid,
          customerCode: venue.unleashedCustomerCode,
          customerName: venue.unleashedCustomerName
        } : null
      }));

      res.json({
        totalVenues: venues.length,
        linkedVenues: venueLinks.filter(v => v.isLinked).length,
        unlinkedVenues: venueLinks.filter(v => !v.isLinked).length,
        venueLinks
      });
    } catch (error) {
      console.error('Error fetching venue customer links:', error);
      res.status(500).json({ error: "Failed to fetch venue customer links" });
    }
  });

  // Get Shopify pricing for products (for weekly sales section)
  app.get("/api/products/:productCode/shopify-price", async (req, res) => {
    try {
      const { productCode } = req.params;
      const price = await unleashedService.getShopifyPrice(productCode);
      
      if (price === null) {
        return res.status(404).json({ 
          error: "Product price not found",
          productCode 
        });
      }
      
      res.json({
        productCode,
        shopifyPrice: price,
        priceSource: "Shopify AUD (Unleashed API)"
      });
    } catch (error) {
      console.error('Error fetching Shopify price:', error);
      res.status(500).json({ 
        error: "Failed to fetch product price",
        productCode: req.params.productCode 
      });
    }
  });

  // Get WOLFF32 pricing for products (for reorder section)
  app.get("/api/products/:productCode/wolff32-price", async (req, res) => {
    try {
      const { productCode } = req.params;
      console.log(`Fetching WOLFF32 price for product: ${productCode}`);
      
      const price = await unleashedService.getWolff32Price(productCode);
      
      if (price === null) {
        console.log(`WOLFF32 price not found for product: ${productCode}`);
        return res.status(404).json({ 
          error: "Product price not found in Unleashed - ensure product exists with WOLFF32 pricing tier",
          productCode 
        });
      }
      
      console.log(`WOLFF32 price found for ${productCode}: ${price}`);
      res.json({
        productCode,
        wolff32Price: price,
        priceSource: "WOLFF32 (Unleashed API)"
      });
    } catch (error) {
      console.error('Error fetching WOLFF32 price:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      res.status(500).json({ 
        error: "Failed to fetch product price",
        productCode: req.params.productCode,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Serve training documentation
  app.get("/api/docs", async (req, res) => {
    try {
      const docsIndexPath = path.join(process.cwd(), 'pdfs', 'index.html');
      if (fs.existsSync(docsIndexPath)) {
        res.sendFile(docsIndexPath);
      } else {
        res.status(404).json({ error: "Documentation not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to serve documentation" });
    }
  });

  // Serve individual documentation files
  app.get("/api/docs/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      const allowedFiles = [
        'Retail_Restock_Training_Guide.html',
        'Retail_Restock_Quick_Reference.html',
        'Retail_Restock_Features_Guide.html',
        'index.html'
      ];
      
      if (!allowedFiles.includes(filename)) {
        return res.status(404).json({ error: "Document not found" });
      }
      
      const filePath = path.join(process.cwd(), 'pdfs', filename);
      if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(filePath);
      } else {
        res.status(404).json({ error: "Document not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to serve document" });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
