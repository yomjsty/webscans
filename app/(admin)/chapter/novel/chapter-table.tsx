import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ActionButton from "@/components/action-button";

interface ChapterTableProps {
    chapters: {
        id: string;
        title: string;
        alternativeTitle: string | null;
        novel?: { title: string };
        isPremium: boolean;
        price?: number;
        isPublished: boolean;
    }[];
}

export default function ChapterTable({ chapters }: ChapterTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Fungsi untuk memfilter data berdasarkan query pencarian
    const filteredChapters = chapters.filter((chapter) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            chapter.title.toLowerCase().includes(searchLower) ||
            chapter.alternativeTitle?.toLowerCase().includes(searchLower) ||
            chapter.novel?.title.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search Chapters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border rounded"
                />
            </div>
            <div className="w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Parent Series</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Alternative Title</TableHead>
                            <TableHead>Premium</TableHead>
                            <TableHead>Price (if Premium)</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredChapters.map((chapter) => (
                            <TableRow key={chapter.id}>
                                <TableCell className="font-medium">
                                    {chapter.novel?.title}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {chapter.title}
                                </TableCell>
                                <TableCell>
                                    {chapter.alternativeTitle}
                                </TableCell>
                                <TableCell>
                                    {chapter.isPremium ? "Yes" : "No"}
                                </TableCell>
                                <TableCell>{chapter.price}</TableCell>
                                <TableCell>
                                    {chapter.isPublished ? "Yes" : "No"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <ActionButton
                                        Id={chapter.id}
                                        type="novel"
                                        category="chapter"
                                        title={chapter.title}
                                        group="chapter"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
