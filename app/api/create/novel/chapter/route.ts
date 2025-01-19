import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { createChapterSchema } from "@/lib/schema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const validatedData = createChapterSchema.parse(body);

        const {
            alternativeTitle,
            slug,
            content,
            title,
            price,
            parentSeries,
            isPremium,
            isPublished,
        } = validatedData;
        
        if (!title || !slug || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (isPremium && (!price || price < 1)) {
            return NextResponse.json({ error: "Price must be at least 1 for premium content" }, { status: 400 });
        }

        await db.chapter.create({
            data: {
                alternativeTitle,
                slug,
                content,
                title,
                price: isPremium ? price : 0,
                isPremium,
                novel: parentSeries ? { connect: { id: parentSeries[0] } } : undefined,
                isPublished
            },
        });

        return NextResponse.json({ message: "Chapter created successfully" });
    } catch (error) {
        console.error("Something went wrong:", error);
        return NextResponse.json({ error: "Failed to create chapter" }, { status: 500 });
    }
}
