import "dotenv/config";
import { db } from "../src/lib/db";
import { getUserByUsername } from "../src/lib/repositories/users";

async function main() {
    const user = await getUserByUsername("local-dev-user");

    console.log("Database connection successful. Sample query result:", user);
    process.exit(1);
}

main().catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});