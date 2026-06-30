import { db } from "@/lib/db";

export type Resume = {
    id: number;
    userId: number;
    resumeText: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function getCurrentResumeForUser(userId: number): Promise<Resume | null> {
    const result = await db.query<Resume>(
        `SELECT 
            id, 
            user_id AS "userId",
            resume_text AS "resumeText",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
         FROM resumes
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [userId]
    );

    return result.rows[0] ?? null;
}

export async function upsertResumeForUser(userId: number, resumeText: string): Promise<Resume> {
    const existingResume = await getCurrentResumeForUser(userId);

    if (!existingResume) {

        const result = await db.query<Resume>(
            `INSERT INTO resumes (user_id, resume_text, created_at, updated_at)
            VALUES ($1, $2, NOW(), NOW())
            RETURNING 
                id, 
                user_id AS "userId",
                resume_text AS "resumeText",
                created_at AS "createdAt",
                updated_at AS "updatedAt"`,
            [userId, resumeText]
        );

        return result.rows[0];
    }

    const result = await db.query<Resume>(
        `UPDATE resumes
         SET resume_text = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING 
            id, 
            user_id AS "userId",
            resume_text AS "resumeText",
            created_at AS "createdAt",
            updated_at AS "updatedAt"`,
        [resumeText, existingResume.id]
    );

    return result.rows[0];  
}