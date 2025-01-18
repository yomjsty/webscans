"use client";

import { useState, useEffect, useCallback } from "react";

export function useReviews(
    seriesId: string,
    type: "comic" | "novel",
    limit = 10
) {
    interface Review {
        id: string;
        comment: string;
        rating: number;
        user: { id: string; name: string };
    }

    const [reviews, setReviews] = useState<Review[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchReviews = useCallback(
        async (cursor: string | null = null) => {
            if (!seriesId || !type) return;

            setLoading(true);
            try {
                const url = new URL("/api/review", window.location.origin);
                url.searchParams.append("seriesId", seriesId);
                url.searchParams.append("type", type);
                url.searchParams.append("limit", limit.toString());
                if (cursor) url.searchParams.append("cursor", cursor);

                const res = await fetch(url.toString());
                if (!res.ok) throw new Error("Failed to fetch reviews");

                const data = await res.json();
                setReviews((prev) =>
                    cursor ? [...prev, ...data.reviews] : data.reviews
                );
                setNextCursor(data.nextCursor);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
        [seriesId, type, limit]
    );

    // Ambil review saat seriesId atau type berubah
    useEffect(() => {
        setReviews([]); // Reset state sebelum mengambil data baru
        setNextCursor(null);
        fetchReviews();
    }, [seriesId, type, fetchReviews]);

    return {
        reviews,
        setReviews, // Ditambahkan agar bisa digunakan untuk menghapus review
        nextCursor,
        loading,
        loadMore: () => fetchReviews(nextCursor),
    };
}
