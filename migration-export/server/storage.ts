import { 
  users, venues, products, venueProducts, restockSessions,
  type User, type Venue, type Product, type VenueProduct, type RestockSession,
  type InsertUser, type InsertVenue, type InsertProduct, type InsertVenueProduct, type InsertRestockSession,
  type VenueWithProducts, type RestockItem
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Venues
  getVenues(): Promise<Venue[]>;
  getVenueById(id: number): Promise<Venue | undefined>;
  getVenueWithProducts(id: number): Promise<VenueWithProducts | undefined>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  updateVenue(id: number, updates: Partial<Venue>): Promise<Venue | undefined>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Venue Products
  getVenueProducts(venueId: number): Promise<(VenueProduct & { product: Product })[]>;
  createVenueProduct(venueProduct: InsertVenueProduct): Promise<VenueProduct>;

  // Restock Sessions
  getRestockSessions(): Promise<RestockSession[]>;
  getRestockSessionById(id: number): Promise<RestockSession | undefined>;
  createRestockSession(session: InsertRestockSession): Promise<RestockSession>;
  updateRestockSession(id: number, updates: Partial<RestockSession>): Promise<RestockSession | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private venues: Map<number, Venue> = new Map();
  private products: Map<number, Product> = new Map();
  private venueProducts: Map<number, VenueProduct> = new Map();
  private restockSessions: Map<number, RestockSession> = new Map();
  private currentUserId = 1;
  private currentVenueId = 1;
  private currentProductId = 1;
  private currentVenueProductId = 1;
  private currentRestockSessionId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create real team members
    const teamMembers = [
      { name: "Keenan Curran", username: "keenan-curran" },
      { name: "Abbie Moore", username: "abbie-moore" },
      { name: "Aaron Leck", username: "aaron-leck" },
      { name: "James Thai", username: "james-thai" },
      { name: "Hayden Bryant", username: "hayden-bryant" },
      { name: "Hannah Butkus", username: "hannah-butkus" },
    ];

    teamMembers.forEach(user => {
      const newUser: User = { id: this.currentUserId++, ...user };
      this.users.set(newUser.id, newUser);
    });

    // Create real venues
    const realVenues = [
      { name: "Bru Cru", address: "2069 Moggill Rd, Kenmore QLD 4069", code: "bru-cru" },
      { name: "All Sew", address: "7/41 Graham Rd, Carseldine QLD 4034", code: "all-sew" },
      { name: "Golly Gosh", address: "92 Hyde Rd, Yeronga QLD 4104", code: "golly-gosh" },
      { name: "Kenrose Bakery", address: "4/18 Kenrose St, Carina QLD 4152", code: "kenrose-bakery" },
      { name: "Boiler Room", address: "3/193 South Pine Rd, Brendale QLD 4500", code: "boiler-room" },
    ];

    realVenues.forEach(venue => {
      const newVenue: Venue = { 
        id: this.currentVenueId++, 
        ...venue,
        unleashedCustomerGuid: null,
        unleashedCustomerCode: null,
        unleashedCustomerName: null
      };
      this.venues.set(newVenue.id, newVenue);
    });

    // Create sample products
    const sampleProducts = [
      { name: "Ethiopian Single Origin", code: "ETH-001", type: "coffee", returnType: "returned", price: "28.50" },
      { name: "Colombian Blend", code: "COL-002", type: "coffee", returnType: "returned", price: "24.00" },
      { name: "House Roast", code: "HSE-003", type: "coffee", returnType: "returned", price: "22.00" },
      { name: "Ceramic Mugs - White", code: "MUG-WHT", type: "merchandise", returnType: "consumed", price: "15.00" },
      { name: "Ceramic Mugs - Black", code: "MUG-BLK", type: "merchandise", returnType: "consumed", price: "15.00" },
      { name: "Travel Tumbler", code: "TUM-001", type: "merchandise", returnType: "consumed", price: "25.00" },
      { name: "Gift Cards $25", code: "GFT-025", type: "merchandise", returnType: "consumed", price: "25.00" },
      { name: "Coffee Beans Grinder", code: "GRD-001", type: "merchandise", returnType: "consumed", price: "45.00" },
    ];

    sampleProducts.forEach(product => {
      const newProduct: Product = { 
        id: this.currentProductId++, 
        ...product,
        orderMultiplier: 1,
        reorderThreshold: 0
      };
      this.products.set(newProduct.id, newProduct);
    });

    // Create venue-product relationships with par levels
    const venueProductMappings = [
      // Bru Cru
      { venueId: 1, productId: 1, parLevel: 12 },
      { venueId: 1, productId: 2, parLevel: 8 },
      { venueId: 1, productId: 4, parLevel: 6 },
      { venueId: 1, productId: 6, parLevel: 4 },
      { venueId: 1, productId: 7, parLevel: 10 },
      
      // All Sew
      { venueId: 2, productId: 1, parLevel: 10 },
      { venueId: 2, productId: 3, parLevel: 15 },
      { venueId: 2, productId: 5, parLevel: 8 },
      { venueId: 2, productId: 8, parLevel: 2 },
      
      // Golly Gosh
      { venueId: 3, productId: 2, parLevel: 6 },
      { venueId: 3, productId: 3, parLevel: 12 },
      { venueId: 3, productId: 4, parLevel: 4 },
      { venueId: 3, productId: 6, parLevel: 6 },
      
      // Kenrose Bakery
      { venueId: 4, productId: 1, parLevel: 8 },
      { venueId: 4, productId: 2, parLevel: 10 },
      { venueId: 4, productId: 5, parLevel: 5 },
      { venueId: 4, productId: 7, parLevel: 8 },

      // Boiler Room
      { venueId: 5, productId: 1, parLevel: 14 },
      { venueId: 5, productId: 3, parLevel: 18 },
      { venueId: 5, productId: 4, parLevel: 8 },
      { venueId: 5, productId: 8, parLevel: 3 },
    ];

    venueProductMappings.forEach(mapping => {
      const newVenueProduct: VenueProduct = { id: this.currentVenueProductId++, ...mapping };
      this.venueProducts.set(newVenueProduct.id, newVenueProduct);
    });
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = { id: this.currentUserId++, ...user };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async getVenues(): Promise<Venue[]> {
    return Array.from(this.venues.values());
  }

  async getVenueById(id: number): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  async getVenueWithProducts(id: number): Promise<VenueWithProducts | undefined> {
    const venue = this.venues.get(id);
    if (!venue) return undefined;

    const venueProducts = Array.from(this.venueProducts.values())
      .filter(vp => vp.venueId === id)
      .map(vp => {
        const product = this.products.get(vp.productId);
        return product ? { ...vp, product } : null;
      })
      .filter(Boolean) as (VenueProduct & { product: Product })[];

    return { ...venue, products: venueProducts };
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const newVenue: Venue = { 
      id: this.currentVenueId++, 
      ...venue,
      unleashedCustomerGuid: venue.unleashedCustomerGuid || null,
      unleashedCustomerCode: venue.unleashedCustomerCode || null,
      unleashedCustomerName: venue.unleashedCustomerName || null
    };
    this.venues.set(newVenue.id, newVenue);
    return newVenue;
  }

  async updateVenue(id: number, updates: Partial<Venue>): Promise<Venue | undefined> {
    const venue = this.venues.get(id);
    if (!venue) return undefined;
    
    const updatedVenue = { ...venue, ...updates };
    this.venues.set(id, updatedVenue);
    return updatedVenue;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = { 
      id: this.currentProductId++, 
      ...product,
      returnType: product.returnType || "consumed",
      orderMultiplier: product.orderMultiplier || 1,
      reorderThreshold: product.reorderThreshold || 0
    };
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }

  async getVenueProducts(venueId: number): Promise<(VenueProduct & { product: Product })[]> {
    return Array.from(this.venueProducts.values())
      .filter(vp => vp.venueId === venueId)
      .map(vp => {
        const product = this.products.get(vp.productId);
        return product ? { ...vp, product } : null;
      })
      .filter(Boolean) as (VenueProduct & { product: Product })[];
  }

  async createVenueProduct(venueProduct: InsertVenueProduct): Promise<VenueProduct> {
    const newVenueProduct: VenueProduct = { id: this.currentVenueProductId++, ...venueProduct };
    this.venueProducts.set(newVenueProduct.id, newVenueProduct);
    return newVenueProduct;
  }

  async getRestockSessions(): Promise<RestockSession[]> {
    return Array.from(this.restockSessions.values());
  }

  async getRestockSessionById(id: number): Promise<RestockSession | undefined> {
    return this.restockSessions.get(id);
  }

  async createRestockSession(session: InsertRestockSession): Promise<RestockSession> {
    const newSession: RestockSession = { 
      id: this.currentRestockSessionId++, 
      userId: session.userId,
      venueId: session.venueId,
      visitDate: session.visitDate,
      visitTime: session.visitTime,
      comments: session.comments || null,
      itemsData: session.itemsData,
      status: "pending",
      unleashedOrderId: null,
      unleashedInvoiceId: null,
      totalValue: null,
      createdAt: new Date()
    };
    this.restockSessions.set(newSession.id, newSession);
    return newSession;
  }

  async updateRestockSession(id: number, updates: Partial<RestockSession>): Promise<RestockSession | undefined> {
    const session = this.restockSessions.get(id);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates };
    this.restockSessions.set(id, updatedSession);
    return updatedSession;
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getVenues(): Promise<Venue[]> {
    return await db.select().from(venues);
  }

  async getVenueById(id: number): Promise<Venue | undefined> {
    const [venue] = await db.select().from(venues).where(eq(venues.id, id));
    return venue || undefined;
  }

  async getVenueWithProducts(id: number): Promise<VenueWithProducts | undefined> {
    const venue = await this.getVenueById(id);
    if (!venue) return undefined;

    const venueProductsList = await db
      .select({
        id: venueProducts.id,
        venueId: venueProducts.venueId,
        productId: venueProducts.productId,
        parLevel: venueProducts.parLevel,
        product: products
      })
      .from(venueProducts)
      .innerJoin(products, eq(venueProducts.productId, products.id))
      .where(eq(venueProducts.venueId, id));

    return { 
      ...venue, 
      products: venueProductsList.map(vp => ({
        id: vp.id,
        venueId: vp.venueId,
        productId: vp.productId,
        parLevel: vp.parLevel,
        product: vp.product
      }))
    };
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const [newVenue] = await db
      .insert(venues)
      .values(venue)
      .returning();
    return newVenue;
  }

  async updateVenue(id: number, updates: Partial<Venue>): Promise<Venue | undefined> {
    const [updatedVenue] = await db
      .update(venues)
      .set(updates)
      .where(eq(venues.id, id))
      .returning();
    return updatedVenue;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async getVenueProducts(venueId: number): Promise<(VenueProduct & { product: Product })[]> {
    const venueProductsList = await db
      .select({
        id: venueProducts.id,
        venueId: venueProducts.venueId,
        productId: venueProducts.productId,
        parLevel: venueProducts.parLevel,
        product: products
      })
      .from(venueProducts)
      .innerJoin(products, eq(venueProducts.productId, products.id))
      .where(eq(venueProducts.venueId, venueId));

    return venueProductsList.map(vp => ({
      id: vp.id,
      venueId: vp.venueId,
      productId: vp.productId,
      parLevel: vp.parLevel,
      product: vp.product
    }));
  }

  async createVenueProduct(venueProduct: InsertVenueProduct): Promise<VenueProduct> {
    const [newVenueProduct] = await db
      .insert(venueProducts)
      .values(venueProduct)
      .returning();
    return newVenueProduct;
  }

  async getRestockSessions(): Promise<RestockSession[]> {
    return await db.select().from(restockSessions);
  }

  async getRestockSessionById(id: number): Promise<RestockSession | undefined> {
    const [session] = await db.select().from(restockSessions).where(eq(restockSessions.id, id));
    return session || undefined;
  }

  async createRestockSession(session: InsertRestockSession): Promise<RestockSession> {
    const [newSession] = await db
      .insert(restockSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async updateRestockSession(id: number, updates: Partial<RestockSession>): Promise<RestockSession | undefined> {
    const [updatedSession] = await db
      .update(restockSessions)
      .set(updates)
      .where(eq(restockSessions.id, id))
      .returning();
    return updatedSession || undefined;
  }
}

// Use DatabaseStorage for production reliability
export const storage = new DatabaseStorage();
