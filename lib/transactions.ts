import db from "@/lib/db";

export async function hasPurchasedChapter(userId: string, chapterId: string) {
    const transaction = await db.transaction.findFirst({
        where: {
            userId,
            chapterId,
            status: "completed", // Pastikan hanya transaksi yang berhasil
        },
    });

    return !!transaction; // True jika transaksi ditemukan, false jika tidak
}