"use server";

import db from "@/lib/db";

export async function buyChapter({
    userId,
    chapterId,
    price,
    chapterTitle,
    seriesTitle,
}: {
    userId: string;
    chapterId: string;
    price: number;
    chapterTitle: string;
    seriesTitle: string;
}) {
    if (!userId) {
        return { success: false, message: "User tidak ditemukan." };
    }

    // Ambil user untuk mengecek saldo koin
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { coins: true },
    });

    if (!user) {
        return { success: false, message: "User tidak valid." };
    }

    if (user.coins < price) {
        return { success: false, message: "Koin tidak cukup untuk membeli chapter ini." };
    }

    // Kurangi koin user dan buat transaksi baru
    await db.$transaction([
        db.user.update({
            where: { id: userId },
            data: { coins: { decrement: price } },
        }),
        db.transaction.create({
            data: {
                userId,
                chapterId,
                amount: price,
                type: "buy",
                item: "chapter",
                details: `${chapterTitle} - ${seriesTitle}`,
                status: "completed",
                quantity: 1,
                price: price,
                orderId: `order-${Date.now()}`,
            },
        }),
    ]);

    return { success: true };
}
