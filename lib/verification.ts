import { auth } from "./auth";
import {NextRequest} from "next/server";

export async function verifyApiKey(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) {
        return {success: false, error: "API key is missing"};
    }

    const data = await auth.api.verifyApiKey({
        body: {
            key: apiKey
        },
    });

    if (!data.valid) {
        return {success: false, error: "API key is invalid"};
    }
    if (data?.key?.expiresAt && new Date(data.key.expiresAt) < new Date()) {
        return {success: false, error: "API key is expired"};
    }
    return {success: true, data};
}