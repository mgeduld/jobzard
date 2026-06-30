import "dotenv/config";
import { getUserByUsername } from "@/lib/repositories/users";
import { upsertResumeForUser } from "@/lib/repositories/resumes";
import { upsertJobDescriptionForUser } from "@/lib/repositories/jobDescriptions";
import { MockAnalysisProvider } from "@/lib/ai/providers/mockAnalysisProvider";
import { analyzeFit } from "@/lib/services/analyzeFit";

async function main() { 
    const user = await getUserByUsername("local-dev-user");
    console.log("User:", user);

    if (!user) {
        console.error("User not found.");
        process.exit(1);
    }

    const resume = await upsertResumeForUser(user.id, "This is a test resume text.");
    console.log("Upserted Resume:", resume);

    const jobDescription = await upsertJobDescriptionForUser(user.id, "This is a test job description text.");
    console.log("Upserted Job Description:", jobDescription);

    const provider = new MockAnalysisProvider();
    const analysisResult = await analyzeFit({provider, resumeId: resume.id, jobDescriptionId: jobDescription.id});
    console.log("Analysis Result:", analysisResult);
}

main().catch((error) => {
    console.error("Error testing analyzeFit service:", error);
    process.exit(1);
});