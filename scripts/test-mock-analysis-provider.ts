import { MockAnalysisProvider } from "@/lib/ai/providers/mockAnalysisProvider";
import type {
  AnalyzeResumeForJobInput,
  AnalyzeResumeForJobResult,
} from "@/lib/ai/providers/types";

const provider = new MockAnalysisProvider();

async function testMockAnalysisProvider() {
  const input: AnalyzeResumeForJobInput = {
    resumeText: "This is a sample resume text.",
    jobDescriptionText: "This is a sample job description text.",
  };

  try {
    const result: AnalyzeResumeForJobResult = await provider.analyzeResumeForJob(input);
    console.log("Mock analysis result:", result);
  } catch (error) {
    console.error("Error during mock analysis:", error);
  }
}

testMockAnalysisProvider();