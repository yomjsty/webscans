import db from "@/lib/db";
import { getServerSession } from "@/actions/getServerSession";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

        // Cek apakah sudah ada bookmark
        const existingBookmark = await db.bookmark.findFirst({
            where: {
                userId,
                novelId: novelId || undefined,
                comicId: comicId || undefined,
            },
        });

        if (existingBookmark) {
            // Jika sudah ada, hapus bookmark
            await db.bookmark.delete({ where: { id: existingBookmark.id } });
            return NextResponse.json({ message: "Bookmark removed" });
        }

        // Jika belum ada, tambahkan bookmark
        await db.bookmark.create({
            data: {
                userId,
                novelId: novelId || undefined,
                comicId: comicId || undefined,
            },
        });

        return NextResponse.json({ message: "Bookmark added" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}