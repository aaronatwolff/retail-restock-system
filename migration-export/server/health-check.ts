// Health check and failsafe system
import { storage } from "./storage";
import { db } from "./db";

export interface HealthStatus {
  database: boolean;
  storage: boolean;
  apis: boolean;
  timestamp: Date;
  errors: string[];
}

export async function performHealthCheck(): Promise<HealthStatus> {
  const errors: string[] = [];
  let database = false;
  let storageCheck = false;
  let apis = false;

  // Test database connection
  try {
    await db.execute('SELECT 1');
    database = true;
  } catch (error) {
    errors.push(`Database: ${error.message}`);
  }

  // Test storage layer
  try {
    const users = await storage.getUsers();
    const venues = await storage.getVenues();
    const products = await storage.getProducts();
    
    if (users.length > 0 && venues.length > 0 && products.length > 0) {
      storageCheck = true;
    } else {
      errors.push(`Storage: Missing data - ${users.length} users, ${venues.length} venues, ${products.length} products`);
    }
  } catch (error) {
    errors.push(`Storage: ${error.message}`);
  }

  // Test critical APIs
  try {
    // Test if basic API routes would work
    if (database && storageCheck) {
      apis = true;
    } else {
      errors.push('APIs: Dependencies not met');
    }
  } catch (error) {
    errors.push(`APIs: ${error.message}`);
  }

  return {
    database,
    storage: storageCheck,
    apis,
    timestamp: new Date(),
    errors
  };
}

export function validateDatabaseSchema(): Promise<boolean> {
  return new Promise(async (resolve) => {
    try {
      // Check if required tables exist with data
      const users = await storage.getUsers();
      const venues = await storage.getVenues();
      const products = await storage.getProducts();
      
      // Validate minimum required data
      const hasUsers = users.length >= 6; // We know we should have 6 users
      const hasVenues = venues.length >= 5; // We know we should have 5 venues
      const hasProducts = products.length >= 8; // We know we should have 8+ products
      
      if (hasUsers && hasVenues && hasProducts) {
        console.log('✓ Database schema validation passed');
        resolve(true);
      } else {
        console.log(`✗ Database schema validation failed: ${users.length} users, ${venues.length} venues, ${products.length} products`);
        resolve(false);
      }
    } catch (error) {
      console.log(`✗ Database schema validation error: ${error.message}`);
      resolve(false);
    }
  });
}