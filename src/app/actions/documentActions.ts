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

export type DocumentActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

const mockAnalysisProvider = new MockAnalysisProvider();

export async function saveDocuments(
  _previousState: DocumentActionState,
  formData: FormData,
): Promise<DocumentActionState> {
  const resumeText = String(formData.get("resumeText") ?? "");
  const jobDescriptionText = String(formData.get("jobDescriptionText") ?? "");

  const user = await getUserByUsername("local-dev-user");

  if (!user) {
    return {
      status: "error",
      message: "Local dev user not found",
    };
  }

  await upsertResumeForUser(user.id, resumeText);
  await upsertJobDescriptionForUser(user.id, jobDescriptionText);

  revalidatePath("/");
  
  return {
    status: "success",
    message: "Documents saved",
  };
}

export async function analyzeCurrentFit(
  _previousState: DocumentActionState,
): Promise<DocumentActionState> {
  const user = await getUserByUsername("local-dev-user");

  if (!user) {
    return {
      status: "error",
      message: "Local dev user not found",
    };
  }

  const resume = await getCurrentResumeForUser(user.id);
  const jobDescription = await getCurrentJobDescriptionForUser(user.id);

  if (
    !resume?.resumeText.trim() ||
    !jobDescription?.jobText.trim()
  ) {
    return {
      status: "error",
      message: "Both resume and job description must be provided to analyze fit.",
    };
  }

  await analyzeFit({
    resumeId: resume.id,
    jobDescriptionId: jobDescription.id,
    provider: mockAnalysisProvider,
  });

  revalidatePath("/");

  return {
    status: "success",
    message: "Analysis complete.",
  };
}