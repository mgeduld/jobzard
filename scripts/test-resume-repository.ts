import "dotenv/config";
import { 
    getCurrentResumeForUser,
    upsertResumeForUser,
} from "../src/lib/repositories/resumes";

async function main() {
    const userId = 1; // Replace with the actual user ID you want to test

    // Test getting the current resume for the user
    const currentResume = await getCurrentResumeForUser(userId);
    console.log("Current Resume:", currentResume);

    // Test upserting the resume for the user
    const newResumeText = `This is updated resume text. (${new Date().toISOString()})`;
    const updatedResume = await upsertResumeForUser(userId, newResumeText);
    console.log("Updated Resume:", updatedResume);

    process.exit(1);
}

main().catch((error) => {
    console.error("Error testing resume repository:", error);
    process.exit(1);
});