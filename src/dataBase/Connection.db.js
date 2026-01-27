import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const pool = new pg.Pool({ connectionString });

const prisma =
  globalThis.prisma ||
  new PrismaClient({
    adapter: new PrismaPg(pool),
  });

globalThis.prisma = prisma;

export default prisma;
