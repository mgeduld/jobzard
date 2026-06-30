import "dotenv/config";
import { db } from "../src/lib/db";

async function main() {
    const result = await db.query("SELECT username FROM users LIMIT 1");

    console.log("Database connection successful. Sample query result:", result.rows);
    process.exit(1);
}

main().catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});