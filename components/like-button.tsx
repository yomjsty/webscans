"use client";

import { useState, useTransition } from "react";

interface LikeButtonProps {
    initialLikeStatus: boolean;
    novelSlug: string;
    userId?: string; // Bisa undefined jika user belum login
}

export default function LikeButton({
    initialLikeStatus,
    novelSlug,
    userId,
}: LikeButtonProps) {
    const [isLiked, setIsLiked] = useState(initialLikeStatus);
    const [isPending, startTransition] = useTransition();

    const handleLike = async () => {
        if (!userId) return; // Jika tidak ada userId, tombol tidak akan merespons klik

        startTransition(async () => {
            try {
                const res = await fetch(`/api/novel/${novelSlug}/like`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ novelSlug }),
                });

                if (!res.ok) throw new Error("Failed to update like status");

                const data = await res.json();
                setIsLiked(data.liked);
            } catch (error) {
                console.error(error);
            }
        });
    };

    return (
        <button
            onClick={handleLike}
            disabled={!userId || isPending}
            className={`px-4 py-2 rounded ${
                !userId
                    ? "bg-gray-300 cursor-not-allowed" // Jika tidak login, tetap abu-abu
                    : isLiked
                    ? "bg-red-500" // Jika sudah like, merah
                    : "bg-gray-300" // Jika belum like, abu-abu
            }`}
        >
            {!userId ? "Like" : isLiked ? "Unlike ❤️" : "Like 🤍"}
        </button>
    );
}
