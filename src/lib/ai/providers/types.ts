import type { ResumeJobAnalysis } from "@/lib/ai/types";

export type AnalyzeResumeForJobInput = {
  resumeText: string;
  jobDescriptionText: string;
};

export type AnalyzeResumeForJobResult = {
  analysis: ResumeJobAnalysis;
  modelMetadata: {
    provider: string;
    model: string;
    isMock: boolean;
  };
};

export type AnalysisProvider = {
  analyzeResumeForJob(
    input: AnalyzeResumeForJobInput,
  ): Promise<AnalyzeResumeForJobResult>;
};