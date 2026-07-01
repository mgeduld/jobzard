import { analyzeCurrentFit, saveDocuments } from "@/app/actions/documentActions";
import { ResumeJobAnalysis } from "@/lib/ai/types";

type ResumeJobEditorProps = {
  initialResumeText: string;
  initialJobDescriptionText: string;
  latestAnalysis: ResumeJobAnalysis | null;
  canAnalyze: boolean;
};

export function ResumeJobEditor({
  initialResumeText,
  initialJobDescriptionText,
  latestAnalysis,
  canAnalyze,
}: ResumeJobEditorProps) {
  return (
    <section>
        <form action={saveDocuments}>
        <div>
            <label htmlFor="resumeText">Resume</label>
            <textarea
            id="resumeText"
            name="resumeText"
            defaultValue={initialResumeText}
            rows={16}
            />
        </div>

        <div>
            <label htmlFor="jobDescriptionText">Job Description</label>
            <textarea
            id="jobDescriptionText"
            name="jobDescriptionText"
            defaultValue={initialJobDescriptionText}
            rows={16}
            />
        </div>

        <button type="submit">Save</button>
        </form>

        <form action={analyzeCurrentFit}>
            <button type="submit" disabled={!canAnalyze}>Analyze Fit</button>
        </form>

         {!canAnalyze && (
              <p>Save both a resume and a job description before running analysis.</p>
         )}

        {latestAnalysis && (
            <section>
                <h2>Latest Analysis</h2>
                <p>
                <strong>Fit Score:</strong> {latestAnalysis.fitScore}
                </p>

                <p>{latestAnalysis.summary}</p>

                <h3>Strong Matches</h3>
                <ul>
                {latestAnalysis.strongMatches.map((item) => (
                    <li key={item}>{item}</li>
                ))}
                </ul>

                <h3>Gaps</h3>
                <ul>
                {latestAnalysis.gaps.map((item) => (
                    <li key={item}>{item}</li>
                ))}
                </ul>

                <h3>Suggested Resume Improvements</h3>
                <ul>
                {latestAnalysis.suggestedResumeImprovements.map((item) => (
                    <li key={item}>{item}</li>
                ))}
                </ul>

                <h3>Caveats</h3>
                <ul>
                {latestAnalysis.caveats.map((item) => (
                    <li key={item}>{item}</li>
                ))}
                </ul>
            </section>
        )}
     </section>
  );
}