"use client";

import { useActionState } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { analyzeCurrentFit, saveDocuments } from "@/app/actions/documentActions";
import { ResumeJobAnalysis } from "@/lib/ai/types";

type ResumeJobEditorProps = {
    initialResumeText: string;
    initialJobDescriptionText: string;
    latestAnalysis: ResumeJobAnalysis | null;
    canAnalyze: boolean;
};

const initialActionState = {
    status: "idle" as const,
    message: null,
};

export function ResumeJobEditor({
    initialResumeText,
    initialJobDescriptionText,
    latestAnalysis,
    canAnalyze,
}: ResumeJobEditorProps) {
    const [saveState, saveAction, isSaving] = useActionState(
        saveDocuments,
        initialActionState,
    );

    const [analyzeState, analyzeAction, isAnalyzing] = useActionState(
        analyzeCurrentFit,
        initialActionState,
    );

    return (
        <section>
            <Paper sx={{ p: 3 }} elevation={1}>
                <Stack component="form" action={saveAction} spacing={3} sx={{ mb: 3 }}>
                    <TextField
                        label="Resume"
                        name="resumeText"
                        defaultValue={initialResumeText}
                        multiline
                        minRows={12}
                        fullWidth
                    />

                    <TextField
                        label="Job Description"
                        name="jobDescriptionText"
                        defaultValue={initialJobDescriptionText}
                        multiline
                        minRows={12}
                        fullWidth
                    />

                    <Button type="submit" variant="contained" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save"}
                    </Button>

                    {saveState.message && (
                        <Typography
                            variant="body2"
                            color={saveState.status === "error" ? "error" : "success.main"}
                        >
                            {saveState.message}
                        </Typography>
                    )}
                </Stack>

                <Stack component="form" action={analyzeAction} spacing={1}>
                    <Button type="submit" variant="contained" disabled={!canAnalyze || isSaving}>
                        {isAnalyzing ? "Analyzing..." : "Analyze Fit"}
                    </Button>

                    {analyzeState.message && (
                        <Typography
                            variant="body2"
                            color={analyzeState.status === "error" ? "error" : "success.main"}
                        >
                            {analyzeState.message}
                        </Typography>
                    )}

                    {!canAnalyze && (
                        <Typography variant="body2" color="text.secondary">
                            Save both a resume and a job description before running analysis.
                        </Typography>
                    )}
                </Stack>
            </Paper>

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