"use client";

import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { useState } from "react";

interface CoverImageUploadProps {
    onUpload: (url: string) => void;
}

export default function CoverImageUpload({ onUpload }: CoverImageUploadProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    return (
        <div className="flex flex-col items-start space-y-4">
            <UploadButton
                endpoint="coverImage"
                onClientUploadComplete={(res) => {
                    const uploadedImageUrl = res?.[0]?.url;
                    if (uploadedImageUrl) {
                        setImageUrl(uploadedImageUrl);
                        onUpload(uploadedImageUrl);
                    }
                }}
                onUploadError={(error: Error) => {
                    console.error("Upload failed:", error);
                    alert(`Upload Error: ${error.message}`);
                }}
            />

            {imageUrl && (
                <Image
                    src={imageUrl}
                    alt="Uploaded Cover Image"
                    width={300}
                    height={200}
                    className="rounded-md shadow-md object-cover w-auto h-auto"
                />
            )}
        </div>
    );
}
