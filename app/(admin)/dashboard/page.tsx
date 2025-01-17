"use client";

import { useState } from "react";
import CoverImageUpload from "@/components/CoverImageUpload";

export default function NewComicPage() {
    const [coverImage, setCoverImage] = useState<string | null>(null);

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
            <h1 className="text-xl font-bold">Upload Cover Image</h1>

            {/* ✅ Sekarang `CoverImageUpload` menerima prop `onUpload` dengan benar */}
            <CoverImageUpload onUpload={setCoverImage} />

            {coverImage && (
                <div className="mt-4">
                    <p>Cover Image URL:</p>
                    <code className="break-words text-sm bg-gray-100 p-2 rounded">
                        {coverImage}
                    </code>
                </div>
            )}
        </div>
    );
}
