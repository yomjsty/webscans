import db from "@/lib/db";
import { getServerSession } from "@/actions/getServerSession";
import { NextRequest, NextResponse } from "next/server";

// Tambah bookmark (POST)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { novelId, comicId } = await req.json();
        const userId = session.user.id;

        if (!novelId && !comicId) {
            return NextResponse.json({ error: "NovelId or ComicId is required" }, { status: 400 });
        }

        // Tambahkan bookmark
        await db.bookmark.create({
            data: {
                userId,
                novelId: novelId || undefined,
                comicId: comicId || undefined,
            },
        });

        return NextResponse.json({ message: "Bookmark added" }, { status: 201 });
    } catch (error) {
        console.error("Error adding bookmark:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Hapus bookmark (DELETE)
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { novelId, comicId } = await req.json();
        const userId = session.user.id;

        if (!novelId && !comicId) {
            return NextResponse.json({ error: "NovelId or ComicId is required" }, { status: 400 });
        }

        // Hapus bookmark berdasarkan novelId atau comicId
        await db.bookmark.deleteMany({
            where: {
                userId,
                novelId: novelId || undefined,
                comicId: comicId || undefined,
            },
        });

        return NextResponse.json({ message: "Bookmark removed" }, { status: 200 });
    } catch (error) {
        console.error("Error removing bookmark:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
