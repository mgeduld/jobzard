import { Pool } from "pg";

const connectionSTring = process.env.DATABASE_URL;

if (!connectionSTring) {
  throw new Error("DATABASE_URL is not defined");
}

export const db = new Pool({
  connectionString: connectionSTring,
});