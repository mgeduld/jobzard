"use server";

import { revalidatePath } from "next/cache";
import { getUserByUsername } from "@/lib/repositories/users";
import { upsertResumeForUser } from "@/lib/repositories/resumes";
import { upsertJobDescriptionForUser } from "@/lib/repositories/jobDescriptions";
import { getCurrentResumeForUser } from "@/lib/repositories/resumes";
import { getCurrentJobDescriptionForUser } from "@/lib/repositories/jobDescriptions";
import { getAnalysisProvider } from "@/lib/ai/providers/getAnalysisProvider";
import { analyzeFit } from "@/lib/services/analyzeFit";

export type DocumentActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

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

  try {
    await analyzeFit({
      resumeId: resume.id,
      jobDescriptionId: jobDescription.id,
      provider: getAnalysisProvider(),
    });

    revalidatePath("/");

    return {
      status: "success",
      message: "Analysis complete.",
    };
  } catch (error) {
    console.error("Error occurred while analyzing fit:", error);
    return {
      status: "error",
      message: "The AI provider returned an invalid response. Please try again.",
    };
  }
};