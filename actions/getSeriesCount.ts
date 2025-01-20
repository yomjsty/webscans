"use server";

import db from "@/lib/db"; // Pastikan ini mengarah ke Prisma Client

export async function getSeriesCount() {
    try {
        const comicSeries = await db.comic.count();
        const novelSeries = await db.novel.count();
        const totalSeries = novelSeries + comicSeries;

        return { totalSeries, novelSeries, comicSeries };
    } catch (error) {
        console.error("Error fetching series count:", error);
        return { totalSeries: 0, novelSeries: 0, comicSeries: 0 };
    }
}
