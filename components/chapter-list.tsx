import Link from "next/link";
import db from "@/lib/db";
import BuyChapterButton from "./BuyChapterButton";
import { getServerSession } from "@/actions/getServerSession";
import { hasPurchasedChapter } from "@/lib/transactions";

interface ChapterListProps {
    parentSeriesId: string;
    type: "novel" | "comic";
    seriesSlug: string;
    seriesTitle: string;
}

export default async function ChapterList({
    parentSeriesId,
    type,
    seriesSlug,
    seriesTitle,
}: ChapterListProps) {
    if (!parentSeriesId) return null;

    // Tentukan field berdasarkan tipe (novel atau comic)
    const parentField = type === "novel" ? "novelId" : "comicId";

    // Fetch sesi user
    const session = await getServerSession();
    const userId = session?.user?.id ?? null;

    // Fetch chapters berdasarkan parentSeriesId dengan isPublished = true
    const chapters = await db.chapter.findMany({
        where: {
            [parentField]: parentSeriesId,
            isPublished: true,
        },
        orderBy: { createdAt: "asc" },
        select: {
            id: true,
            title: true,
            slug: true,
            isPremium: true,
            price: true,
        },
    });

    if (!chapters.length) {
        return <p>No chapters available.</p>;
    }

    return (
        <div>
            <h2>Chapters</h2>
            <ul>
                {await Promise.all(
                    chapters.map(async (chapter) => {
                        const hasPurchased = userId
                            ? await hasPurchasedChapter(userId, chapter.id)
                            : false;

                        return (
                            <li key={chapter.id} className="mb-2">
                                <Link
                                    href={`${seriesSlug}/${chapter.slug}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    {chapter.title}
                                </Link>
                                {chapter.isPremium && (
                                    <div className="flex justify-between">
                                        <span className="ml-2 text-red-500">
                                            (Premium - {chapter.price} coins)
                                        </span>
                                        <BuyChapterButton
                                            userId={userId}
                                            chapterId={chapter.id}
                                            price={chapter.price || 0}
                                            hasPurchased={hasPurchased}
                                            chapterTitle={chapter.title}
                                            seriesTitle={seriesTitle}
                                        />
                                    </div>
                                )}
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
}
