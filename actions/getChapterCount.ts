"use server";

import db from "@/lib/db"; // Pastikan ini mengarah ke Prisma Client

export async function getChapterCount() {
    try {
        const novelChapter = await db.chapter.count({
            where: { novelId: { not: null } },
        });

        const comicChapter = await db.chapter.count({
            where: { comicId: { not: null } },
        });

        const totalChapter = novelChapter + comicChapter;

        return { totalChapter, novelChapter, comicChapter };
    } catch (error) {
        console.error("Error fetching chapter count:", error);
        return { totalChapter: 0, novelChapter: 0, comicChapter: 0 };
    }
}
