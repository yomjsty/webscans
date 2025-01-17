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
    const chapters = await db.chapter.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            novel: true,
        },
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <div className="text-2xl font-bold">Novel Chapter Page</div>
                <Button className="ml-auto">
                    <Link href="/chapter/novel/create">
                        Create Novel Chapter
                    </Link>
                </Button>
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
                        {chapters.map((chapter) => (
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
