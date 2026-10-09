import { NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/verification";

export async function GET(request: Request) {
    const verified = await verifyApiKey(request as any);
    if (!verified.success) {
        return NextResponse.json({ error: verified.error }, { status: 401 });
    }
    const res = await fetch("https://hackatime.hackclub.com/api/v1/users/SPJ27/stats")
    const body  = await res.json();
    return NextResponse.json(body);
}

