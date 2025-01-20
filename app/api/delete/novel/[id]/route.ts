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
    const novelId = id

    if (!novelId) {
        return NextResponse.json({ error: "Novel ID is required" }, { status: 400 });
    }

    try {
        // Cari novel sebelum menghapus (opsional, bisa digunakan untuk validasi tambahan)
        const existingNovel = await db.novel.findUnique({
            where: { id: novelId },
        });

        if (!existingNovel) {
            return NextResponse.json({ error: "Novel not found" }, { status: 404 });
        }

        // Hapus novel dari database
        await db.novel.delete({
            where: { id: novelId },
        });

        return NextResponse.json({ message: "Novel deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting novel:", error);
        return NextResponse.json({ error: "Failed to delete novel" }, { status: 500 });
    }
}
