import { db } from "@/lib/db";

export type JobDescription = {
    id: number;
    userId: number;
    jobText: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function getCurrentJobDescriptionForUser(userId: number): Promise<JobDescription | null> {
    const result = await db.query<JobDescription>(
        `SELECT 
            id, 
            user_id AS "userId",
            job_text AS "jobText",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
         FROM job_descriptions
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [userId]
    );

    return result.rows[0] ?? null;
}

export async function upsertJobDescriptionForUser(userId: number, jobText: string): Promise<JobDescription> {
    const existingJobDescription = await getCurrentJobDescriptionForUser(userId);

    if (!existingJobDescription) {
        const result = await db.query<JobDescription>(
            `INSERT INTO job_descriptions (user_id, job_text, created_at, updated_at)
            VALUES ($1, $2, NOW(), NOW())
            RETURNING 
                id, 
                user_id AS "userId",
                job_text AS "jobText",
                created_at AS "createdAt",
                updated_at AS "updatedAt"`,
            [userId, jobText]
        );

        return result.rows[0];
    }

    const result = await db.query<JobDescription>(
        `UPDATE job_descriptions
         SET job_text = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING 
            id, 
            user_id AS "userId",
            job_text AS "jobText",
            created_at AS "createdAt",
            updated_at AS "updatedAt"`,
        [jobText, existingJobDescription.id]
    );

    return result.rows[0];
}   