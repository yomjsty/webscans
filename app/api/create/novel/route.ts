import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { createNovelSchema } from "@/lib/schema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const validatedData = createNovelSchema.parse(body);

        const {
            alternativeTitle,
            author,
            coverImage,
            genre,
            releaseYear,
            slug,
            status,
            synopsis,
            title
        } = validatedData;

        if (!author || !coverImage || !genre || !releaseYear || !slug || !status || !synopsis || !title) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await db.novel.create({
            data: {
                alternativeTitle,
                author,
                coverImage,
                genres: genre,
                releaseYear: parseInt(releaseYear, 10),
                slug,
                status,
                synopsis,
                title,
            },
        });

        return NextResponse.json({ message: "Novel series created successfully" });
    } catch (error) {
        console.error("Something went wrong:", error);
        return NextResponse.json({ error: "Failed to create novel series" }, { status: 500 });
    }
}