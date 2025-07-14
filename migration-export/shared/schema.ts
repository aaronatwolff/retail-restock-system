import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
});

export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  code: text("code").notNull().unique(),
  unleashedCustomerGuid: text("unleashed_customer_guid"),
  unleashedCustomerCode: text("unleashed_customer_code"),
  unleashedCustomerName: text("unleashed_customer_name"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  type: text("type").notNull(), // 'coffee' or 'merchandise'
  returnType: text("return_type").notNull().default("consumed"), // 'returned' or 'consumed'
  orderMultiplier: integer("order_multiplier").default(1), // units per order (4 for 4-pack, 16 for 16-pack)
  reorderThreshold: integer("reorder_threshold").default(0), // minimum stock before reorder
  price: text("price").notNull(), // Keep as text for compatibility
});

export const venueProducts = pgTable("venue_products", {
  id: serial("id").primaryKey(),
  venueId: integer("venue_id").notNull().references(() => venues.id),
  productId: integer("product_id").notNull().references(() => products.id),
  parLevel: integer("par_level").notNull(),
});

export const restockSessions = pgTable("restock_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  venueId: integer("venue_id").notNull().references(() => venues.id),
  visitDate: text("visit_date").notNull(),
  visitTime: text("visit_time").notNull(),
  comments: text("comments"),
  unleashedOrderId: text("unleashed_order_id"),
  unleashedInvoiceId: text("unleashed_invoice_id"),
  status: text("status").notNull().default("pending"), // pending, submitted, completed, failed
  totalValue: decimal("total_value", { precision: 10, scale: 2 }),
  itemsData: jsonb("items_data").notNull(), // Array of item quantities and calculations
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertVenueSchema = createInsertSchema(venues).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertVenueProductSchema = createInsertSchema(venueProducts).omit({ id: true });
export const insertRestockSessionSchema = createInsertSchema(restockSessions).omit({ 
  id: true, 
  createdAt: true,
  unleashedOrderId: true,
  unleashedInvoiceId: true,
  status: true,
  totalValue: true 
});

export type User = typeof users.$inferSelect;
export type Venue = typeof venues.$inferSelect;
export type Product = typeof products.$inferSelect;
export type VenueProduct = typeof venueProducts.$inferSelect;
export type RestockSession = typeof restockSessions.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertVenue = z.infer<typeof insertVenueSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertVenueProduct = z.infer<typeof insertVenueProductSchema>;
export type InsertRestockSession = z.infer<typeof insertRestockSessionSchema>;

// Additional types for the frontend
export type VenueWithProducts = Venue & {
  products: (VenueProduct & { product: Product })[];
};

export type RestockItem = {
  productId: number;
  productCode: string;
  productName: string;
  productType: string;
  productReturnType: string;
  productPrice: string;
  parLevel: number;
  quantity: number; // returned for "returned" type, remaining for "consumed" type
  soldQuantity: number;
  reorderThreshold: number;
};
