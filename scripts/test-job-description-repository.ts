import "dotenv/config";
import { getCurrentJobDescriptionForUser, upsertJobDescriptionForUser } from "../src/lib/repositories/jobDescriptions";

async function main() {
    const userId = 1; // Replace with the actual user ID you want to test

    // Test getting the current job description for the user
    const currentJobDescription = await getCurrentJobDescriptionForUser(userId);
    console.log("Current Job Description:", currentJobDescription);

    // Test upserting the job description for the user
    const newJobDescriptionText = `This is an updated job description. (${new Date().toISOString()})`;
    const updatedJobDescription = await upsertJobDescriptionForUser(userId, newJobDescriptionText);
    console.log("Updated Job Description:", updatedJobDescription);

    process.exit(1);
}

main().catch((error) => {
    console.error("Error testing job description repository:", error);
    process.exit(1);
}); 