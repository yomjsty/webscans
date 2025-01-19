import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
    try {
        const novels = await db.novel.findMany({
            select: {
                id: true,
                title: true,
            },
            orderBy: {
                title: "asc",
            },
        });

        return NextResponse.json({ novels });
    } catch (error) {
        console.error("Error fetching novels:", error);
        return NextResponse.json({ error: "Failed to fetch novels" }, { status: 500 });
    }
}
