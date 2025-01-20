import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const chapterId = id;

    if (!chapterId) {
        return NextResponse.json({ error: "Chapter ID is required" }, { status: 400 });
    }

    try {
        // Cari chapter sebelum menghapus (opsional, bisa digunakan untuk validasi tambahan)
        const existingChapter = await db.chapter.findUnique({
            where: { id: chapterId },
        });

        if (!existingChapter) {
            return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
        }

        // Hapus chapter dari database
        await db.chapter.delete({
            where: { id: chapterId },
        });

        return NextResponse.json({ message: "Chapter deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting chapter:", error);
        return NextResponse.json({ error: "Failed to delete chapter" }, { status: 500 });
    }
}
