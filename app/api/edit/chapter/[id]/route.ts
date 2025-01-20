import db from "@/lib/db"; // Menggunakan Prisma ORM
import { NextResponse } from "next/server";
import { createChapterSchema } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Handler untuk mengambil detail chapter
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const chapter = await db.chapter.findUnique({
            where: {
                id: id,
            },
            include: {
                novel: true, // Jika relasi yang benar adalah novel
                comic: true, // Jika relasi yang benar adalah comic
            },
        });

        if (!chapter) {
            return NextResponse.json({ message: "Chapter tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Terjadi kesalahan saat mengambil detail chapter" }, { status: 500 });
    }
}

// Handler untuk memperbarui chapter
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const validatedData = createChapterSchema.parse(body);

        const {
            alternativeTitle,
            content,
            parentSeries, // Jika ini adalah novel atau comic, sesuaikan dengan data yang benar
            price,
            slug,
            title,
            isPremium,
            isPublished,
        } = validatedData;

        if (!title || !content || !parentSeries || !slug) {
            return NextResponse.json({ error: "Field yang dibutuhkan tidak lengkap" }, { status: 400 });
        }

        console.log("Validated Data:", validatedData);

        // Memeriksa apakah chapter ada sebelum diperbarui
        const existingChapter = await db.chapter.findUnique({
            where: { id: id },
        });

        if (!existingChapter) {
            return NextResponse.json({ error: "Chapter tidak ditemukan" }, { status: 404 });
        }

        const updateData: {
            alternativeTitle?: string;
            content?: string;
            price?: number | null;
            slug?: string;
            title?: string;
            isPremium?: boolean;
            isPublished?: boolean;
            novel?: { connect: { id: string } } | undefined;
            comic?: { connect: { id: string } } | undefined;
        } = {
            alternativeTitle,
            content,
            price: isPremium ? price : 0,
            slug,
            title,
            isPremium,
            isPublished,
            novel: undefined, // Pastikan tidak mengirim `undefined`
            comic: undefined, // Pastikan tidak mengirim `undefined`
        };

        if (parentSeries.length > 0) {
            const parentId = parentSeries[0]; // Ambil ID pertama (karena hanya bisa satu)

            const novelExists = await db.novel.findUnique({ where: { id: parentId } });
            const comicExists = await db.comic.findUnique({ where: { id: parentId } });

            if (novelExists) {
                updateData.novel = { connect: { id: parentId } };
                updateData.comic = undefined; // Pastikan comic tidak tersambung
            } else if (comicExists) {
                updateData.comic = { connect: { id: parentId } };
                updateData.novel = undefined; // Pastikan novel tidak tersambung
            } else {
                return NextResponse.json({ error: "Novel atau Comic tidak ditemukan" }, { status: 400 });
            }
        }

        // Memperbarui chapter di database
        await db.chapter.update({
            where: { id: id },
            data: updateData,
        });

        return NextResponse.json({ message: "Chapter berhasil diperbarui" });
    } catch (error) {
        console.error("Terjadi kesalahan saat memperbarui chapter:", error);
        return NextResponse.json({ error: "Gagal memperbarui chapter" }, { status: 500 });
    }
}
