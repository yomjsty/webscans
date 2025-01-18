import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { userId, seriesId, type, rating, review } = await req.json();

        if (!userId || !seriesId || !rating || !review) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const existingReview = await db.review.findFirst({
            where: {
                userId,
                [type === "comic" ? "comicId" : "novelId"]: seriesId,
            },
        });

        if (existingReview) {
            return NextResponse.json({ error: "You have already reviewed this series" }, { status: 409 });
        }

        const newReview = await db.review.create({
            data: {
                userId,
                rating,
                comment: review,
                comicId: type === "comic" ? seriesId : null,
                novelId: type === "novel" ? seriesId : null,
            },
        });

        return NextResponse.json(newReview, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const seriesId = searchParams.get("seriesId");
        const type = searchParams.get("type");
        const userId = searchParams.get("userId");
        const cursor = searchParams.get("cursor"); // Untuk pagination
        const limit = parseInt(searchParams.get("limit") || "10", 10); // Default 10 review per request

        if (!seriesId || !type) {
            return NextResponse.json({ error: "seriesId and type are required" }, { status: 400 });
        }

        // Menentukan filter berdasarkan tipe (comic atau novel)
        const filter = {
            [type === "comic" ? "comicId" : "novelId"]: seriesId,
        };

        let hasReviewed = false;
        if (userId) {
            // Log untuk memeriksa data yang dikirim
            console.log('Checking if user has reviewed this series...');
            console.log('Filter used for check:', filter);
            console.log('userId:', userId);

            const existingReview = await db.review.findFirst({
                where: {
                    ...filter,
                    userId,
                },
            });

            // Log untuk memeriksa hasil query
            console.log('Existing Review:', existingReview);

            hasReviewed = !!existingReview;
        }

        // Ambil data dengan pagination
        const reviews = await db.review.findMany({
            where: filter,
            take: limit + 1, // Ambil satu data ekstra untuk cek apakah ada halaman berikutnya
            skip: cursor ? 1 : 0, // Lewati satu jika ada cursor
            cursor: cursor ? { id: cursor } : undefined, // Gunakan cursor jika ada
            orderBy: { createdAt: "desc" }, // Urutkan dari yang terbaru
            include: {
                user: {
                    select: { id: true, name: true }, // Ambil ID dan Nama pengguna
                },
            },
        });

        let nextCursor = null;
        if (reviews.length > limit) {
            const nextItem = reviews.pop(); // Hapus item ekstra dan simpan cursor baru
            nextCursor = nextItem?.id;
        }

        return NextResponse.json({ reviews, nextCursor, hasReviewed });
    } catch {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const reviewId = searchParams.get("reviewId");
        const userId = searchParams.get("userId");

        if (!reviewId || !userId) {
            return NextResponse.json({ error: "reviewId and userId are required" }, { status: 400 });
        }

        // Cari review yang ingin dihapus
        const review = await db.review.findUnique({
            where: { id: reviewId },
            select: { userId: true },
        });

        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        // Pastikan user yang menghapus adalah user yang menulis review
        if (review.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Hapus review
        await db.review.delete({
            where: { id: reviewId },
        });

        return NextResponse.json({ message: "Review deleted successfully" });
    } catch {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}