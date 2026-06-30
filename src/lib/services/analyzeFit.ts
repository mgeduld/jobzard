import { createAnalysisRun } from "@/lib/repositories/analysisRuns";
import type { AnalysisProvider } from "@/lib/ai/providers/types";
import { getResumeById } from "@/lib/repositories/resumes";
import { getJobDescriptionById } from "@/lib/repositories/jobDescriptions";

export async function analyzeFit( params: { 
  resumeId: number,
  jobDescriptionId: number,
  provider: AnalysisProvider
}) {
    const resume = await getResumeById(params.resumeId);
    if (!resume) {
        throw new Error("Resume not found");
    }

    const jobDescription = await getJobDescriptionById(params.jobDescriptionId);
    if (!jobDescription) {
        throw new Error("Job description not found");
    }
    const analysisResult = await params.provider.analyzeResumeForJob({
        resumeText: resume.resumeText,
        jobDescriptionText: jobDescription.jobText,
    });
    
    return createAnalysisRun({
        resumeId: params.resumeId,
        jobDescriptionId: params.jobDescriptionId,
        aiResultJson: analysisResult.analysis,
        modelMetadata: analysisResult.modelMetadata,
    });
}