"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { buyChapter } from "@/actions/buyChapter";
import { useRouter } from "next/navigation";

interface BuyChapterButtonProps {
    userId: string | null;
    chapterId: string;
    price: number;
    hasPurchased: boolean;
    chapterTitle: string;
    seriesTitle: string;
}

export default function BuyChapterButton({
    userId,
    chapterId,
    price,
    hasPurchased,
    chapterTitle,
    seriesTitle,
}: BuyChapterButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleBuy = async () => {
        if (!userId) {
            alert("Anda harus login untuk membeli chapter.");
            return;
        }

        setLoading(true);
        try {
            const response = await buyChapter({
                userId,
                chapterId,
                price,
                chapterTitle,
                seriesTitle,
            });

            if (response.success) {
                alert("Chapter berhasil dibeli!");
            } else {
                alert(response.message || "Gagal membeli chapter.");
            }
            router.refresh();
        } catch {
            alert("Terjadi kesalahan.");
        } finally {
            setLoading(false);
        }
    };

    if (hasPurchased) {
        return <span className="text-green-500">✔️ Sudah Dibeli</span>;
    }

    return (
        <Button onClick={handleBuy} disabled={loading}>
            {loading ? "Memproses..." : `Beli (${price} coins)`}
        </Button>
    );
}
