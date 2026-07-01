import "dotenv/config";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { saveDocuments, type DocumentActionState } from "./documentActions";
import { getUserByUsername } from "@/lib/repositories/users";
import { getCurrentResumeForUser } from "@/lib/repositories/resumes";
import { getCurrentJobDescriptionForUser } from "@/lib/repositories/jobDescriptions";

const idleState: DocumentActionState = {
  status: "idle",
  message: null,
};

describe("documentActions", () => {
  it("saveDocuments saves resume and job description text", async () => {
    const formData = new FormData();

    formData.set("resumeText", "Test resume text");
    formData.set("jobDescriptionText", "Test job description text");

    const result = await saveDocuments(idleState, formData);

    expect(result).toEqual({
      status: "success",
      message: "Documents saved",
    });

    const user = await getUserByUsername("local-dev-user");

    if (!user) {
      throw new Error("Expected local-dev-user to exist");
    }

    const resume = await getCurrentResumeForUser(user.id);
    const jobDescription = await getCurrentJobDescriptionForUser(user.id);

    expect(resume?.resumeText).toBe("Test resume text");
    expect(jobDescription?.jobText).toBe("Test job description text");
  });
});