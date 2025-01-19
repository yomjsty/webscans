import { notFound } from "next/navigation";
import db from "@/lib/db";
import { getServerSession } from "@/actions/getServerSession";
import { hasPurchasedChapter } from "@/lib/transactions";

interface ChapterPageProps {
    params: Promise<{
        slug: string;
        chapter: string;
    }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
    const { slug, chapter } = await params;
    const session = await getServerSession();
    const userId = session?.user?.id;

    // Ambil novel berdasarkan slug
    const novel = await db.novel.findUnique({
        where: { slug },
        select: { id: true, title: true },
    });

    if (!novel) {
        notFound();
    }

    // Ambil data chapter berdasarkan novelId dan slug chapter
    const chapterData = await db.chapter.findFirst({
        where: {
            novelId: novel.id,
            slug: chapter,
            isPublished: true,
        },
        select: {
            id: true,
            title: true,
            alternativeTitle: true,
            content: true,
            isPremium: true,
            price: true,
        },
    });

    if (!chapterData) {
        notFound();
    }

    if (chapterData.isPremium && !userId) {
        return (
            <p>Anda harus login terlebih dahulu untuk membaca chapter ini.</p>
        );
    }

    // Jika chapter premium, cek apakah user sudah membeli
    if (chapterData.isPremium && userId) {
        const hasPurchased = await hasPurchasedChapter(userId, chapterData.id);

        if (!hasPurchased) {
            return (
                <p>
                    Anda belum membeli chapter ini. Silakan beli terlebih
                    dahulu.
                </p>
            );
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">{chapterData.title}</h1>
            {chapterData.alternativeTitle && (
                <h2 className="text-lg italic">
                    {chapterData.alternativeTitle}
                </h2>
            )}
            <div className="mt-4">
                <p>{chapterData.content}</p>
            </div>
        </div>
    );
}
