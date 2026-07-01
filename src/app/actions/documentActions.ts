"use server";

import { revalidatePath } from "next/cache";
import { getUserByUsername } from "@/lib/repositories/users";
import { upsertResumeForUser } from "@/lib/repositories/resumes";
import { upsertJobDescriptionForUser } from "@/lib/repositories/jobDescriptions";

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