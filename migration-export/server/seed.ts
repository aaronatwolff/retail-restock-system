import { db } from "./db";
import { users, venues, products, venueProducts, restockSessions } from "@shared/schema";

async function seedDatabase() {
  console.log("Starting database seed...");

  try {
    // Clear existing data in proper order to avoid foreign key constraints
    await db.delete(restockSessions);
    await db.delete(venueProducts);
    await db.delete(products);
    await db.delete(venues);
    await db.delete(users);

    // Seed real team members
    const teamMembers = [
      { name: "Keenan Curran", username: "keenan-curran" },
      { name: "Abbie Moore", username: "abbie-moore" },
      { name: "Aaron Leck", username: "aaron-leck" },
      { name: "James Thai", username: "james-thai" },
      { name: "Hayden Bryant", username: "hayden-bryant" },
      { name: "Hannah Butkus", username: "hannah-butkus" },
    ];

    const insertedUsers = await db.insert(users).values(teamMembers).returning();
    console.log(`Seeded ${insertedUsers.length} team members`);

    // Seed real venues with correct Unleashed customer codes
    const realVenues = [
      { 
        name: "Bru Cru", 
        address: "2069 Moggill Rd, Kenmore QLD 4069", 
        code: "bru-cru",
        unleashedCustomerGuid: null,
        unleashedCustomerCode: "BruCru1",
        unleashedCustomerName: null
      },
      { 
        name: "All Sew", 
        address: "7/41 Graham Rd, Carseldine QLD 4034", 
        code: "all-sew",
        unleashedCustomerGuid: null,
        unleashedCustomerCode: "ALLSEWCOF",
        unleashedCustomerName: null
      },
      { 
        name: "Golly Gosh", 
        address: "92 Hyde Rd, Yeronga QLD 4104", 
        code: "golly-gosh",
        unleashedCustomerGuid: null,
        unleashedCustomerCode: "GOLLYGOSH",
        unleashedCustomerName: null
      },
      { 
        name: "Kenrose Bakery", 
        address: "4/18 Kenrose St, Carina QLD 4152", 
        code: "kenrose-bakery",
        unleashedCustomerGuid: null,
        unleashedCustomerCode: "KENROSE BAKERY",
        unleashedCustomerName: null
      },
      { 
        name: "Boiler Room", 
        address: "3/193 South Pine Rd, Brendale QLD 4500", 
        code: "boiler-room",
        unleashedCustomerGuid: null,
        unleashedCustomerCode: "THEBOILER2",
        unleashedCustomerName: null
      },
    ];

    const insertedVenues = await db.insert(venues).values(realVenues).returning();
    console.log(`Seeded ${insertedVenues.length} venues`);

    // Seed real products from spreadsheet with return types and ordering rules - exact order matching spreadsheet
    const sampleProducts = [
      { name: "Matcha 100g", code: "5916", type: "merchandise", returnType: "consumed", orderMultiplier: 1, reorderThreshold: 0, price: "32.00" }, // 0
      { name: "Cold Brew Concentrate - Individual", code: "7081", type: "coffee", returnType: "consumed", orderMultiplier: 1, reorderThreshold: 1, price: "48.00" }, // 1
      { name: "Cold Brew Concentrate - 4 pack", code: "7084", type: "coffee", returnType: "consumed", orderMultiplier: 4, reorderThreshold: 1, price: "48.00" }, // 2
      { name: "Seasonal Blend", code: "DRK2-SEASONAL", type: "coffee", returnType: "returned", orderMultiplier: 1, reorderThreshold: 0, price: "28.50" }, // 3
      { name: "Instant Wolff", code: "3739E", type: "coffee", returnType: "consumed", orderMultiplier: 1, reorderThreshold: 0, price: "18.00" }, // 4
      { name: "DRK 500g", code: "DRK2-IND", type: "coffee", returnType: "returned", orderMultiplier: 1, reorderThreshold: 0, price: "28.50" }, // 5

      { name: "Big Dog 500g", code: "200056", type: "coffee", returnType: "returned", orderMultiplier: 1, reorderThreshold: 0, price: "35.00" }, // 6
      { name: "Big Dog 250g", code: "200050", type: "coffee", returnType: "returned", orderMultiplier: 1, reorderThreshold: 0, price: "22.00" }, // 7
      { name: "Zero", code: "9493", type: "coffee", returnType: "returned", orderMultiplier: 1, reorderThreshold: 0, price: "28.50" }, // 8
      { name: "Low", code: "9400", type: "coffee", returnType: "returned", orderMultiplier: 1, reorderThreshold: 0, price: "28.50" }, // 9
      { name: "Hero", code: "9495", type: "coffee", returnType: "returned", orderMultiplier: 1, reorderThreshold: 0, price: "28.50" }, // 10
      { name: "Edelweiss 500g", code: "100359", type: "coffee", returnType: "returned", orderMultiplier: 1, reorderThreshold: 0, price: "35.00" }, // 11
      { name: "Lil Red 500g", code: "100469", type: "coffee", returnType: "returned", orderMultiplier: 1, reorderThreshold: 0, price: "35.00" }, // 12
      { name: "Hummingbird 250g", code: "100421", type: "coffee", returnType: "returned", orderMultiplier: 1, reorderThreshold: 0, price: "22.00" }, // 13
      { name: "Zero Pods", code: "CAP201", type: "coffee", returnType: "consumed", orderMultiplier: 1, reorderThreshold: 0, price: "12.00" }, // 14
      { name: "Medium Pods", code: "CAP202", type: "coffee", returnType: "consumed", orderMultiplier: 1, reorderThreshold: 0, price: "12.00" }, // 15
      { name: "Dark Pods", code: "CAP203", type: "coffee", returnType: "consumed", orderMultiplier: 1, reorderThreshold: 0, price: "12.00" }, // 16
      { name: "Drip Coffee 10 Pack", code: "DRIP001", type: "coffee", returnType: "consumed", orderMultiplier: 1, reorderThreshold: 0, price: "15.00" }, // 17
    ];

    const insertedProducts = await db.insert(products).values(sampleProducts).returning();
    console.log(`Seeded ${insertedProducts.length} products`);

    // Create venue-product relationships with authentic venue-specific par levels from original spreadsheet
    const venueProductMappings = [
      // Bru Cru (index 0) - Actual values from spreadsheet column "Bru Cru"
      { venueId: insertedVenues[0].id, productId: insertedProducts[0].id, parLevel: 2 }, // Matcha 100g
      { venueId: insertedVenues[0].id, productId: insertedProducts[1].id, parLevel: 4 }, // Cold Brew Concentrate - Individual (7081)
      { venueId: insertedVenues[0].id, productId: insertedProducts[3].id, parLevel: 2 }, // Seasonal Blend
      { venueId: insertedVenues[0].id, productId: insertedProducts[4].id, parLevel: 2 }, // Instant Wolff
      { venueId: insertedVenues[0].id, productId: insertedProducts[5].id, parLevel: 2 }, // DRK 500g
      { venueId: insertedVenues[0].id, productId: insertedProducts[6].id, parLevel: 10 }, // Big Dog 500g
      { venueId: insertedVenues[0].id, productId: insertedProducts[7].id, parLevel: 4 }, // Big Dog 250g
      { venueId: insertedVenues[0].id, productId: insertedProducts[8].id, parLevel: 2 }, // Zero
      { venueId: insertedVenues[0].id, productId: insertedProducts[9].id, parLevel: 1 }, // Low
      { venueId: insertedVenues[0].id, productId: insertedProducts[10].id, parLevel: 1 }, // Hero
      { venueId: insertedVenues[0].id, productId: insertedProducts[11].id, parLevel: 2 }, // Edelweiss 500g
      { venueId: insertedVenues[0].id, productId: insertedProducts[12].id, parLevel: 2 }, // Lil Red 500g
      { venueId: insertedVenues[0].id, productId: insertedProducts[13].id, parLevel: 2 }, // Hummingbird 250g
      { venueId: insertedVenues[0].id, productId: insertedProducts[14].id, parLevel: 2 }, // Zero Pods
      { venueId: insertedVenues[0].id, productId: insertedProducts[15].id, parLevel: 4 }, // Medium Pods
      { venueId: insertedVenues[0].id, productId: insertedProducts[16].id, parLevel: 4 }, // Dark Pods
      
      // All Sew (index 1) - Actual values from spreadsheet column "All Sew"
      { venueId: insertedVenues[1].id, productId: insertedProducts[0].id, parLevel: 2 }, // Matcha 100g
      { venueId: insertedVenues[1].id, productId: insertedProducts[1].id, parLevel: 4 }, // Cold Brew Concentrate - Individual (7081)
      { venueId: insertedVenues[1].id, productId: insertedProducts[3].id, parLevel: 2 }, // Seasonal Blend
      { venueId: insertedVenues[1].id, productId: insertedProducts[4].id, parLevel: 2 }, // Instant Wolff
      // Note: DRK 500g has 0 par level for All Sew - excluded
      { venueId: insertedVenues[1].id, productId: insertedProducts[6].id, parLevel: 6 }, // Big Dog 500g
      { venueId: insertedVenues[1].id, productId: insertedProducts[7].id, parLevel: 3 }, // Big Dog 250g
      { venueId: insertedVenues[1].id, productId: insertedProducts[8].id, parLevel: 2 }, // Zero
      { venueId: insertedVenues[1].id, productId: insertedProducts[9].id, parLevel: 1 }, // Low
      { venueId: insertedVenues[1].id, productId: insertedProducts[10].id, parLevel: 1 }, // Hero
      { venueId: insertedVenues[1].id, productId: insertedProducts[11].id, parLevel: 2 }, // Edelweiss 500g
      { venueId: insertedVenues[1].id, productId: insertedProducts[12].id, parLevel: 2 }, // Lil Red 500g
      { venueId: insertedVenues[1].id, productId: insertedProducts[13].id, parLevel: 2 }, // Hummingbird 250g
      { venueId: insertedVenues[1].id, productId: insertedProducts[14].id, parLevel: 2 }, // Zero Pods
      { venueId: insertedVenues[1].id, productId: insertedProducts[15].id, parLevel: 4 }, // Medium Pods
      { venueId: insertedVenues[1].id, productId: insertedProducts[16].id, parLevel: 4 }, // Dark Pods
      
      // Golly Gosh (index 2) - Actual values from spreadsheet column "Golly Gosh"
      { venueId: insertedVenues[2].id, productId: insertedProducts[0].id, parLevel: 2 }, // Matcha 100g
      { venueId: insertedVenues[2].id, productId: insertedProducts[1].id, parLevel: 4 }, // Cold Brew Concentrate - Individual (7081)
      { venueId: insertedVenues[2].id, productId: insertedProducts[3].id, parLevel: 2 }, // Seasonal Blend (DRK2)
      { venueId: insertedVenues[2].id, productId: insertedProducts[4].id, parLevel: 2 }, // Instant Wolff
      { venueId: insertedVenues[2].id, productId: insertedProducts[5].id, parLevel: 6 }, // DRK 500g
      { venueId: insertedVenues[2].id, productId: insertedProducts[6].id, parLevel: 4 }, // Big Dog 500g
      { venueId: insertedVenues[2].id, productId: insertedProducts[7].id, parLevel: 2 }, // Big Dog 250g
      { venueId: insertedVenues[2].id, productId: insertedProducts[8].id, parLevel: 2 }, // Zero
      { venueId: insertedVenues[2].id, productId: insertedProducts[9].id, parLevel: 1 }, // Low
      { venueId: insertedVenues[2].id, productId: insertedProducts[10].id, parLevel: 1 }, // Hero
      { venueId: insertedVenues[2].id, productId: insertedProducts[11].id, parLevel: 2 }, // Edelweiss 500g
      { venueId: insertedVenues[2].id, productId: insertedProducts[12].id, parLevel: 2 }, // Lil Red 500g
      { venueId: insertedVenues[2].id, productId: insertedProducts[13].id, parLevel: 2 }, // Hummingbird 250g
      { venueId: insertedVenues[2].id, productId: insertedProducts[14].id, parLevel: 2 }, // Zero Pods
      { venueId: insertedVenues[2].id, productId: insertedProducts[15].id, parLevel: 4 }, // Medium Pods
      { venueId: insertedVenues[2].id, productId: insertedProducts[16].id, parLevel: 4 }, // Dark Pods
      
      // Kenrose Bakery (index 3) - Actual values from spreadsheet column "Kenrose Bakery"
      { venueId: insertedVenues[3].id, productId: insertedProducts[0].id, parLevel: 2 }, // Matcha 100g
      { venueId: insertedVenues[3].id, productId: insertedProducts[1].id, parLevel: 4 }, // Cold Brew Concentrate - Individual (7081)
      { venueId: insertedVenues[3].id, productId: insertedProducts[3].id, parLevel: 2 }, // Seasonal Blend
      // Note: Instant Wolff has 0 par level for Kenrose - excluded
      // Note: DRK 500g has 0 par level for Kenrose - excluded
      { venueId: insertedVenues[3].id, productId: insertedProducts[6].id, parLevel: 6 }, // Big Dog 500g
      { venueId: insertedVenues[3].id, productId: insertedProducts[7].id, parLevel: 3 }, // Big Dog 250g
      { venueId: insertedVenues[3].id, productId: insertedProducts[8].id, parLevel: 2 }, // Zero
      { venueId: insertedVenues[3].id, productId: insertedProducts[9].id, parLevel: 1 }, // Low
      { venueId: insertedVenues[3].id, productId: insertedProducts[10].id, parLevel: 1 }, // Hero
      { venueId: insertedVenues[3].id, productId: insertedProducts[11].id, parLevel: 2 }, // Edelweiss 500g
      { venueId: insertedVenues[3].id, productId: insertedProducts[12].id, parLevel: 2 }, // Lil Red 500g
      { venueId: insertedVenues[3].id, productId: insertedProducts[13].id, parLevel: 2 }, // Hummingbird 250g
      { venueId: insertedVenues[3].id, productId: insertedProducts[14].id, parLevel: 2 }, // Zero Pods
      { venueId: insertedVenues[3].id, productId: insertedProducts[15].id, parLevel: 4 }, // Medium Pods
      { venueId: insertedVenues[3].id, productId: insertedProducts[16].id, parLevel: 4 }, // Dark Pods

      // Boiler Room (index 4) - Actual values from spreadsheet column "Boiler Room"
      { venueId: insertedVenues[4].id, productId: insertedProducts[0].id, parLevel: 2 }, // Matcha 100g
      { venueId: insertedVenues[4].id, productId: insertedProducts[1].id, parLevel: 4 }, // Cold Brew Concentrate - Individual (7081)
      { venueId: insertedVenues[4].id, productId: insertedProducts[3].id, parLevel: 2 }, // Seasonal Blend
      { venueId: insertedVenues[4].id, productId: insertedProducts[4].id, parLevel: 2 }, // Instant Wolff
      // Note: DRK 500g has 0 par level for Boiler Room - excluded
      { venueId: insertedVenues[4].id, productId: insertedProducts[6].id, parLevel: 4 }, // Big Dog 500g
      { venueId: insertedVenues[4].id, productId: insertedProducts[7].id, parLevel: 2 }, // Big Dog 250g
      { venueId: insertedVenues[4].id, productId: insertedProducts[8].id, parLevel: 2 }, // Zero
      // Note: Low has 0 par level for Boiler Room - excluded
      // Note: Hero has 0 par level for Boiler Room - excluded
      // Note: Edelweiss has 0 par level for Boiler Room - excluded
      // Note: Lil Red has 0 par level for Boiler Room - excluded
      // Note: Hummingbird has 0 par level for Boiler Room - excluded
      { venueId: insertedVenues[4].id, productId: insertedProducts[14].id, parLevel: 2 }, // Zero Pods
      { venueId: insertedVenues[4].id, productId: insertedProducts[15].id, parLevel: 4 }, // Medium Pods
      { venueId: insertedVenues[4].id, productId: insertedProducts[16].id, parLevel: 4 }, // Dark Pods
    ];

    const insertedVenueProducts = await db.insert(venueProducts).values(venueProductMappings).returning();
    console.log(`Seeded ${insertedVenueProducts.length} venue-product mappings`);

    console.log("Database seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seed if called directly
seedDatabase().then(() => {
  console.log("Seed completed");
  process.exit(0);
}).catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});

export { seedDatabase };