"use client";

import { useReviews } from "@/hooks/use-reviews";
import { useState } from "react";

interface ReviewsListProps {
    seriesId: string;
    type: "comic" | "novel";
    userId?: string; // Tambahkan userId dari sesi
}

export default function ReviewsList({
    seriesId,
    type,
    userId,
}: ReviewsListProps) {
    const { reviews, nextCursor, loading, loadMore, setReviews } = useReviews(
        seriesId,
        type
    );
    const [deleting, setDeleting] = useState<string | null>(null);

    // Fungsi untuk menghapus review
    const handleDelete = async (reviewId: string) => {
        if (!userId) return;

        setDeleting(reviewId);
        try {
            const response = await fetch(
                `/api/review?reviewId=${reviewId}&userId=${userId}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                setReviews((prevReviews) =>
                    prevReviews.filter((r) => r.id !== reviewId)
                );
            }
        } catch (error) {
            console.error("Failed to delete review:", error);
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div>
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="p-4 border-b flex justify-between items-center"
                >
                    <div>
                        <p className="font-semibold">{review.user.name}</p>
                        <p>⭐ {review.rating}</p>
                        <p>{review.comment}</p>
                    </div>
                    {review.user.id === userId && (
                        <button
                            onClick={() => handleDelete(review.id)}
                            disabled={deleting === review.id}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                            {deleting === review.id ? "Deleting..." : "Delete"}
                        </button>
                    )}
                </div>
            ))}

            {nextCursor && !loading && (
                <button
                    onClick={loadMore}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Load More
                </button>
            )}

            {loading && <p>Loading...</p>}
        </div>
    );
}
