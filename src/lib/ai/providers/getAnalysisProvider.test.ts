import "dotenv/config";
import { describe, expect, it } from "vitest";
import { getAnalysisProvider } from "./getAnalysisProvider";

describe("getAnalysisProvider", () => {
  it("returns the correct provider based on the AI_PROVIDER environment variable", () => {
    process.env.AI_PROVIDER = "mock";
    const mockProvider = getAnalysisProvider();
    expect(mockProvider).toBeDefined();
    expect(mockProvider.analyzeResumeForJob).toBeDefined();

    process.env.AI_PROVIDER = "ollama";
    const ollamaProvider = getAnalysisProvider();
    expect(ollamaProvider).toBeDefined();
    expect(ollamaProvider.analyzeResumeForJob).toBeDefined();
  });

  it("throws an error for an unknown provider", () => {
    process.env.AI_PROVIDER = "unknown";
    expect(() => getAnalysisProvider()).toThrow(
      "Unsupported AI_PROVIDER: unknown",
    );
  });
});