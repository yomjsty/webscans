import Image from "next/image";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import db from "@/lib/db";
import ActionButton from "@/components/action-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function page() {
    const novelSeries = await db.novel.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            chapters: true,
        },
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <div className="text-2xl font-bold">Novel Series Page</div>
                <Button className="ml-auto">
                    <Link href="/series/novel/create">Create Novel Series</Link>
                </Button>
            </div>
            <div className="w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Release Year</TableHead>
                            <TableHead>Chapters</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {novelSeries.map((novel) => (
                            <TableRow key={novel.id}>
                                <TableCell>
                                    <Image
                                        src={novel.coverImage || ""}
                                        alt={`Cover of ${novel.title}`}
                                        width={50}
                                        height={50}
                                        className="rounded-md w-auto h-auto"
                                        priority
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    {novel.title}
                                </TableCell>
                                <TableCell>{novel.author}</TableCell>
                                <TableCell className="capitalize">
                                    {novel.status}
                                </TableCell>
                                <TableCell>{novel.releaseYear}</TableCell>
                                <TableCell>{novel.chapters.length}</TableCell>
                                <TableCell className="text-right">
                                    <ActionButton
                                        Id={novel.id}
                                        type="novel"
                                        category="series"
                                        title={novel.title}
                                        group="novel"
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
