import { db } from "@/lib/db";

export type User = {
    id: number;
    username: string;
    createdAt: Date;
}

export async function getUserByUsername(username: string): Promise<User | null> {
    const result = await db.query<User>(
        `SELECT id, username, created_at AS "createdAt" FROM users WHERE username = $1`,
        [username]
    );

    return result.rows[0] ?? null;
}