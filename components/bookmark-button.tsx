"use client";

import { useState } from "react";

interface BookmarkButtonProps {
    novelId: string;
    userId: string | undefined;
}

export default function BookmarkButton({
    novelId,
    userId,
}: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleBookmark = async () => {
        if (!userId) return alert("You must be logged in to bookmark.");

        const res = await fetch("/api/bookmark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ novelId }),
        });

        if (res.ok) {
            setIsBookmarked(!isBookmarked);
        }
    };

    return (
        <button
            onClick={handleBookmark}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
            {isBookmarked ? "Remove Bookmark" : "Add to Bookmark"}
        </button>
    );
}
