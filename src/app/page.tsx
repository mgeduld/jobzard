import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <div>
          <Typography variant="h3" component="h1">
            Jobzard
          </Typography>
          <Typography color="text.secondary">
            AI-assisted resume and job-description analysis.
          </Typography>
        </div>

        <ResumeJobEditor
          initialResumeText={resume?.resumeText ?? ""}
          initialJobDescriptionText={jobDescription?.jobText ?? ""}
          latestAnalysis={latestAnalysis?.aiResultJson ?? null}
          canAnalyze={canAnalyze}
        />
      </Stack>
    </Container>
  );
}