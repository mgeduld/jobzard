import { ResumeJobEditor } from "@/components/ResumeJobEditor";
import { getUserByUsername } from "@/lib/repositories/users";
import { getCurrentResumeForUser } from "@/lib/repositories/resumes";
import { getCurrentJobDescriptionForUser } from "@/lib/repositories/jobDescriptions";
import { getLatestAnalysisRunForResumeAndJobDescription } from "@/lib/repositories/analysisRuns";

export default async function Home() {
  const user = await getUserByUsername("local-dev-user");

  if (!user) {
    throw new Error("Local dev user not found");
  }

  const resume = await getCurrentResumeForUser(user.id);
  const jobDescription = await getCurrentJobDescriptionForUser(user.id);
  const canAnalyze =
    Boolean(resume?.resumeText.trim()) &&
    Boolean(jobDescription?.jobText.trim());
  const latestAnalysis =
  resume && jobDescription
    ? await getLatestAnalysisRunForResumeAndJobDescription({
        resumeId: resume.id,
        jobDescriptionId: jobDescription.id,
      })
    : null;

  return (
    <main>
      <h1>Jobzard</h1>

      <ResumeJobEditor
        initialResumeText={resume?.resumeText ?? ""}
        initialJobDescriptionText={jobDescription?.jobText ?? ""}
        latestAnalysis={latestAnalysis?.aiResultJson ?? null}
        canAnalyze={canAnalyze}
      />
    </main>
  );
}