import { createAuthClient } from "better-auth/react";
import { redirect } from "next/navigation";

export const authClient = createAuthClient();

const signIn = async () => {
    const data = await authClient.signIn.social({
        provider: "github"
    })
}

const signOut = async() => {
    const data = await authClient.signOut()
}

const requireAuth = async () => {
    const data = await authClient.getSession()
    if (!data) return redirect('/')
    return data
}