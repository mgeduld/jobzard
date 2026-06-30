import "dotenv/config";
import { describe, expect, it } from "vitest";
import { analyzeFit } from "./analyzeFit";
import { getUserByUsername } from "@/lib/repositories/users";
import { upsertResumeForUser } from "@/lib/repositories/resumes";
import { upsertJobDescriptionForUser } from "@/lib/repositories/jobDescriptions";
import type { AnalysisProvider } from "@/lib/ai/providers/types";

const fakeProvider: AnalysisProvider = {
  async analyzeResumeForJob(input) {
    return {
      analysis: {
        fitScore: 82,
        summary: "Fake analysis summary.",
        strongMatches: ["Strong TypeScript experience"],
        gaps: ["Cloud deployment is not clearly shown"],
        suggestedResumeImprovements: ["Clarify testing experience"],
        caveats: [`Resume length: ${input.resumeText.length}`],
      },
      modelMetadata: {
        provider: "fake-test-provider",
        model: "fake-model",
        isMock: true,
      },
    };
  },
};

describe("analyzeFit", () => {
  it("creates and returns an analysis run", async () => {
    const user = await getUserByUsername("local-dev-user");

    if (!user) {
      throw new Error("Expected local-dev-user to exist");
    }

    const resume = await upsertResumeForUser(
      user.id,
      "Experienced TypeScript and React developer.",
    );

    const jobDescription = await upsertJobDescriptionForUser(
      user.id,
      "We need a TypeScript developer with React experience.",
    );

    const analysisRun = await analyzeFit({
      resumeId: resume.id,
      jobDescriptionId: jobDescription.id,
      provider: fakeProvider,
    });

    expect(analysisRun.id).toEqual(expect.any(Number));
    expect(analysisRun.resumeId).toBe(resume.id);
    expect(analysisRun.jobDescriptionId).toBe(jobDescription.id);
    expect(analysisRun.aiResultJson.fitScore).toBe(82);
    expect(analysisRun.modelMetadata).toEqual({
      provider: "fake-test-provider",
      model: "fake-model",
      isMock: true,
    });
  });

  it("throws if the resume does not exist", async () => {
    const user = await getUserByUsername("local-dev-user");

    if (!user) {
      throw new Error("Expected local-dev-user to exist");
    }

    const jobDescription = await upsertJobDescriptionForUser(
      user.id,
      "We need a TypeScript developer.",
    );

    await expect(
      analyzeFit({
        resumeId: 999999,
        jobDescriptionId: jobDescription.id,
        provider: fakeProvider,
      }),
    ).rejects.toThrow("Resume not found");
  });

  it("throws if the job description does not exist", async () => {
    const user = await getUserByUsername("local-dev-user");

    if (!user) {
      throw new Error("Expected local-dev-user to exist");
    }

    const resume = await upsertResumeForUser(
      user.id,
      "Experienced TypeScript developer.",
    );

    await expect(
      analyzeFit({
        resumeId: resume.id,
        jobDescriptionId: 999999,
        provider: fakeProvider,
      }),
    ).rejects.toThrow("Job description not found");
  });
});