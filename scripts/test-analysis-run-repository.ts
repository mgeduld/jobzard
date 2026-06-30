import "dotenv/config";
import {
    createAnalysisRunParams,
    getLatestAnalysisRunForResumeAndJobDescription, 
} from "../src/lib/repositories/analysisRuns";

import { getCurrentResumeForUser } from "../src/lib/repositories/resumes";
import { getCurrentJobDescriptionForUser } from "../src/lib/repositories/jobDescriptions";
import { getUserByUsername } from "../src/lib/repositories/users";

async function main() {
    const username = "local-dev-user"; // Replace with the actual username you want to test
    const user = await getUserByUsername(username);

    if (!user) {
        console.error(`User with username "${username}" not found.`);
        process.exit(1);
    }

    const userId = user.id;

    // Get the current resume and job description for the user
    const currentResume = await getCurrentResumeForUser(userId);
    const currentJobDescription = await getCurrentJobDescriptionForUser(userId);

    if (!currentResume || !currentJobDescription) {
        console.error("Current resume or job description not found for the user.");
        process.exit(1);
    }

    // Create analysis run parameters
    const analysisRunParams = await createAnalysisRunParams({
        resumeId: currentResume.id, 
        jobDescriptionId: currentJobDescription.id, 
        aiResultJson: { score: 0.85, feedback: "Good match" }, 
        modelMetadata: { modelVersion: "1.0.0" }  });

    console.log("Created Analysis Run Params:", analysisRunParams);

    // Get the latest analysis run for the resume and job description
    const latestAnalysisRun = await getLatestAnalysisRunForResumeAndJobDescription({
        resumeId: currentResume.id,
        jobDescriptionId: currentJobDescription.id
    });

    console.log("Latest Analysis Run:", latestAnalysisRun);
    
    process.exit(1);
}

main().catch((error) => {
    console.error("Error testing analysis run repository:", error);
    process.exit(1);
});