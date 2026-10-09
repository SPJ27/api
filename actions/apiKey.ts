'use server'

import { session } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export const generateApiKey = async (name: string, expiresIn: number) => {

    const session = await auth.api.getSession({headers: await headers()})
    
    if (!session) return {error: 'Unauthorized'}
    // if (session.user.id !== process.env.ADMIN_USER_ID) console.log('Unauthorized');
    // if (session.user.id !== process.env.ADMIN_USER_ID) return {error: 'Unauthorized'}
    const data = await auth.api.createApiKey({
    body: {
        name, 
        expiresIn: expiresIn * 24 * 60 * 60, 
        userId: session.user.id, 
        prefix: 'api_spj_',
        rateLimitTimeWindow: 1000 * 60 * 60 * 24, 
        rateLimitMax: 2, 
        rateLimitEnabled: session.user.id !== process.env.ADMIN_USER_ID,
    },
});
    return {name: data.name, key: data.key, expiresAt: data.expiresAt, createdAt: data.createdAt}
}