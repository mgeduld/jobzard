import "dotenv/config";
import { ollamaAnalysisProvider } from "../src/lib/ai/providers/ollamaAnalysisProvider";

async function main() {
  const result = await ollamaAnalysisProvider.analyzeResumeForJob({
    resumeText:
      "Senior full-stack developer with TypeScript, React, Node.js, SQL, and AI application experience.",
    jobDescriptionText:
      "We are looking for a senior full-stack engineer with React, TypeScript, Node.js, SQL, testing, and experience integrating AI features.",
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});