import type { AnalysisProvider } from "@/lib/ai/providers/types";
import { MockAnalysisProvider } from "@/lib/ai/providers/mockAnalysisProvider";
import { ollamaAnalysisProvider } from "@/lib/ai/providers/ollamaAnalysisProvider";

export function getAnalysisProvider(): AnalysisProvider {
  const provider = process.env.AI_PROVIDER ?? "mock";

  switch (provider) {
    case "mock":
      return new MockAnalysisProvider;

    case "ollama":
      return ollamaAnalysisProvider;

    default:
      throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
  }
}