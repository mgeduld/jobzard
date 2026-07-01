import { z } from "zod";

export const resumeJobAnalysisSchema = z.object({
  fitScore: z.number().min(0).max(100),
  summary: z.string().min(1),
  strongMatches: z.array(z.string()),
  gaps: z.array(z.string()),
  suggestedResumeImprovements: z.array(z.string()),
  caveats: z.array(z.string()),
});

export type ResumeJobAnalysis = z.infer<typeof resumeJobAnalysisSchema>;