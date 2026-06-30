export type ResumeJobAnalysis = {
  fitScore: number; // 0–100
  summary: string; // a human-readable overview of the analysis
  strongMatches: string[]; // places where the resume clearly fits the job description
  gaps: string[]; // missing or weakly-represented qualifications in the resume compared to the job description
  suggestedResumeImprovements: string[]; // helpful reframings (not invented experience)
  caveats: string[]; // ambiguities (e.g. "Job description does not specify X")
};