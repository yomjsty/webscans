"use server";

import db from "@/lib/db"; // Pastikan ini mengarah ke Prisma Client

export async function getTransactionCount() {
    try {
        const transactions = await db.transaction.findMany({
            where: { item: "coins", status: "completed" },
            select: {
                createdAt: true,
                price: true,
            },
        });

        const groupedTransactions = transactions.reduce<Record<string, number>>((acc, transaction) => {
            const date = transaction.createdAt.toISOString().split("T")[0];
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += transaction.price;
            return acc;
        }, {});

        return Object.entries(groupedTransactions).map(([date, totalPrice]) => ({
            date,
            totalPrice,
        }));
    } catch (error) {
        console.error("Error fetching transaction count:", error);
        return [];
    }
}