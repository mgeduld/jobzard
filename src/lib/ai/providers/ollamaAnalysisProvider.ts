import type {
  AnalysisProvider,
  AnalyzeResumeForJobInput,
  AnalyzeResumeForJobResult,
} from "@/lib/ai/providers/types";
import type { ResumeJobAnalysis } from "@/lib/ai/types";

type OllamaGenerateResponse = {
  response: string;
  model: string;
  total_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
};

function buildPrompt(input: AnalyzeResumeForJobInput): string {
  return `
You are helping evaluate how well a resume matches a job description.

Return only valid JSON with this shape:
{
  "fitScore": number,
  "summary": string,
  "strongMatches": string[],
  "gaps": string[],
  "suggestedResumeImprovements": string[],
  "caveats": string[]
}

Rules:
- fitScore must be a number from 0 to 100.
- Do not invent experience not present in the resume.
- Suggestions should be truthful reframings or additions only if supported by the resume.
- If the job description is vague, mention that in caveats.

Resume:
${input.resumeText}

Job description:
${input.jobDescriptionText}
`;
}

function parseAnalysisResponse(responseText: string): ResumeJobAnalysis {
  const parsed = JSON.parse(responseText) as ResumeJobAnalysis;

  // Minimal validation for now. We'll improve this later.
  if (typeof parsed.fitScore !== "number") {
    throw new Error("Ollama response missing numeric fitScore");
  }

  if (typeof parsed.summary !== "string") {
    throw new Error("Ollama response missing summary");
  }

  return parsed;
}

export const ollamaAnalysisProvider: AnalysisProvider = {
  async analyzeResumeForJob(
    input: AnalyzeResumeForJobInput,
  ): Promise<AnalyzeResumeForJobResult> {
    const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
    const model = process.env.OLLAMA_MODEL ?? "llama3.2";

    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt: buildPrompt(input),
        stream: false,
        format: "json",
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed with status ${response.status}`);
    }

    const data = (await response.json()) as OllamaGenerateResponse;
    const analysis = parseAnalysisResponse(data.response);

    return {
      analysis,
      modelMetadata: {
        provider: "ollama",
        model: data.model ?? model,
        isMock: false,
      },
    };
  },
};