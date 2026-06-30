import { db } from "@/lib/db";
import { ResumeJobAnalysis } from "@/lib/ai/types";

export type AnalysisRun = {
    id: number;
    resumeId: number;
    jobDescriptionId: number;
    aiResultJson: ResumeJobAnalysis;
    modelMetadata: unknown;
    createdAt: Date;
    updatedAt: Date;
}

export async function createAnalysisRunParams( params: { 
    resumeId: number; 
    jobDescriptionId: number; 
    aiResultJson: ResumeJobAnalysis; 
    modelMetadata?: unknown; }): Promise<AnalysisRun> {
    const result = await db.query<AnalysisRun>(
        `INSERT INTO analysis_runs (resume_id, job_description_id, ai_result_json, model_metadata)
         VALUES ($1, $2, $3, $4)
         RETURNING 
            id,
            resume_id AS "resumeId",
            job_description_id AS "jobDescriptionId",
            ai_result_json AS "aiResultJson",
            model_metadata AS "modelMetadata",
            created_at AS "createdAt"`,
        [ 
          params.resumeId, 
          params.jobDescriptionId, 
          JSON.stringify(params.aiResultJson), 
          params.modelMetadata ? JSON.stringify(params.modelMetadata) : "null"
        ]
    );

    return result.rows[0];

}

export async function getLatestAnalysisRunForResumeAndJobDescription( params: {
    resumeId: number,
    jobDescriptionId: number
}): Promise<AnalysisRun | null> {
    const result = await db.query<AnalysisRun>(
        `SELECT 
            id,
            resume_id AS "resumeId",
            job_description_id AS "jobDescriptionId",
            ai_result_json AS "aiResultJson",
            model_metadata AS "modelMetadata",
            created_at AS "createdAt"
         FROM analysis_runs
         WHERE resume_id = $1 AND job_description_id = $2
         ORDER BY created_at DESC
         LIMIT 1`,
        [params.resumeId, params.jobDescriptionId]
    );

    return result.rows[0] ?? null;
}   