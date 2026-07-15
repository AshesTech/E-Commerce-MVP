import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // We changed this to only use DATABASE_URL, which actually exists in your .env!
    url: env("DATABASE_URL"),
  },
});