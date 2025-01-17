import db from "@/lib/db"; // Assuming you're using Prisma ORM
import { NextResponse } from "next/server";
import { createNovelSchema } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Handler to get the novel details
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const novel = await db.novel.findUnique({
            where: {
                id: id,
            },
        });

        if (!novel) {
            return NextResponse.json({ message: "Novel not found" }, { status: 404 });
        }

        return NextResponse.json(novel);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching novel details" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
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

        // Check if the novel exists before updating
        const existingNovel = await db.novel.findUnique({
            where: { id: id },
        });

        if (!existingNovel) {
            return NextResponse.json({ error: "Novel not found" }, { status: 404 });
        }

        // Update the novel in the database
        await db.novel.update({
            where: { id: id },
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

        return NextResponse.json({ message: "Novel updated successfully" });
    } catch (error) {
        console.error("Error during update:", error);
        return NextResponse.json({ error: "Failed to update novel" }, { status: 500 });
    }
}