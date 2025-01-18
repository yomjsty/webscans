"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
    seriesId: string;
    userId?: string;
    type: string;
}

export default function ReviewForm({
    seriesId,
    userId,
    type,
}: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const router = useRouter();

    interface ReviewData {
        userId: string;
        seriesId: string;
        type: string;
        rating: number;
        review: string;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userId) return alert("You must be logged in to submit a review.");

        if (!rating) {
            return alert("Please select a rating");
        }

        try {
            const checkRes = await fetch(
                `/api/review?seriesId=${seriesId}&type=${type}&userId=${userId}`
            );
            const checkData = await checkRes.json();

            if (checkRes.ok && checkData.hasReviewed) {
                return alert(
                    "You have already reviewed this series. Try deleting your existing review first."
                );
            }

            const res = await fetch("/api/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    seriesId,
                    type,
                    rating,
                    review,
                } as ReviewData),
            });

            if (!res.ok) throw new Error("Failed to submit review");

            alert("Review submitted!");
            setRating(0);
            setReview("");
            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("An unknown error occurred");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-md mt-4">
            <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
            <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl ${
                            star <= rating ? "text-yellow-500" : "text-gray-300"
                        }`}
                    >
                        ★
                    </button>
                ))}
            </div>
            <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review here..."
                className="w-full p-2 border rounded-md"
                required
            ></textarea>
            <button
                type="submit"
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Submit Review
            </button>
        </form>
    );
}
