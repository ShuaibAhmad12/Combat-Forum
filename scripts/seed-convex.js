// This is a script to manually seed the Convex database
// Run with: npx tsx scripts/seed-convex.js

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function seedDatabase() {
  console.log("Starting database seeding...");
  
  try {
    // Call the seed mutation
    const result = await convex.mutation(api.seed.seed);
    console.log("Seed result:", result);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();