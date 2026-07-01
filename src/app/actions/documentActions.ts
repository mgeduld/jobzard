"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUserByUsername } from "@/lib/repositories/users";
import { upsertResumeForUser } from "@/lib/repositories/resumes";
import { upsertJobDescriptionForUser } from "@/lib/repositories/jobDescriptions";
import { getCurrentResumeForUser } from "@/lib/repositories/resumes";
import { getCurrentJobDescriptionForUser } from "@/lib/repositories/jobDescriptions";
import { MockAnalysisProvider } from "@/lib/ai/providers/mockAnalysisProvider";
import { analyzeFit } from "@/lib/services/analyzeFit";

const mockAnalysisProvider = new MockAnalysisProvider();

export async function saveDocuments(formData: FormData) {
  const resumeText = String(formData.get("resumeText") ?? "");
  const jobDescriptionText = String(formData.get("jobDescriptionText") ?? "");

  const user = await getUserByUsername("local-dev-user");

  if (!user) {
    throw new Error("Local dev user not found");
  }

  await upsertResumeForUser(user.id, resumeText);
  await upsertJobDescriptionForUser(user.id, jobDescriptionText);

  revalidatePath("/");
}

export async function analyzeCurrentFit() {
  const user = await getUserByUsername("local-dev-user");

  if (!user) {
    throw new Error("Local dev user not found");
  }

  const resume = await getCurrentResumeForUser(user.id);
  const jobDescription = await getCurrentJobDescriptionForUser(user.id);

  if (
    !resume?.resumeText.trim() ||
    !jobDescription?.jobText.trim()
  ) {
    throw new Error("Resume and job description must both be saved before analysis");
  }

  await analyzeFit({
    resumeId: resume.id,
    jobDescriptionId: jobDescription.id,
    provider: mockAnalysisProvider,
  });

  redirect("/");
}