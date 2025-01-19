"use client";

import { useState } from "react";

interface BookmarkButtonProps {
    novelId: string;
    userId: string | undefined;
    initialBookmarkStatus: boolean;
}

export default function BookmarkButton({
    novelId,
    userId,
    initialBookmarkStatus,
}: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarkStatus);
    const [loading, setLoading] = useState(false);

    const handleBookmark = async () => {
        if (!userId) return alert("You must be logged in to bookmark.");
        setLoading(true);

        try {
            const res = await fetch("/api/bookmark", {
                method: isBookmarked ? "DELETE" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ novelId }),
            });

            if (res.ok) {
                setIsBookmarked(!isBookmarked);
            } else {
                console.error("Failed to update bookmark status");
            }
        } catch (error) {
            console.error("Error updating bookmark:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleBookmark}
            disabled={loading}
            className={`mt-4 px-4 py-2 rounded ${
                isBookmarked ? "bg-red-500" : "bg-blue-500"
            } text-white`}
        >
            {loading
                ? "Processing..."
                : isBookmarked
                ? "Remove Bookmark"
                : "Add to Bookmark"}
        </button>
    );
}
