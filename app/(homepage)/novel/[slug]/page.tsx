import db from "@/lib/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";
import { getServerSession } from "@/actions/getServerSession";
import BookmarkButton from "@/components/bookmark-button";
import ReviewForm from "@/components/review-form";
import ReviewsList from "@/components/review-list";

interface Props {
    params: Promise<{ slug: string }>; // 'slug' parameter dari dynamic route
}

export default async function Page({ params }: Props) {
    const { slug } = await params; // Mengambil slug dari params
    const session = await getServerSession();
    const userId = session?.user.id;

    // Mengambil data novel dari database
    const novel = await db.novel.findUnique({
        where: { slug },
        include: {
            likes: {
                where: { userId },
            },
        },
    });

    // Jika novel tidak ditemukan, tampilkan halaman 404
    if (!novel) {
        notFound();
    }

    // Periksa apakah pengguna sudah memberi like
    const initialLikeStatus = novel.likes.length > 0;

    return (
        <div>
            <h1>Title: {novel.title}</h1>
            <p>Alternative Title: {novel.alternativeTitle}</p>
            <p>Author: {novel.author}</p>
            <p>Synopsis: {novel.synopsis}</p>
            <Image
                src={novel.coverImage}
                alt={novel.title}
                width={200}
                height={300}
                className="w-auto h-auto"
                priority
            />
            <ul>
                {novel.genres.map((genre) => (
                    <li key={genre}>{genre}</li>
                ))}
            </ul>
            <p>Status: {novel.status}</p>
            <p>Release Year: {novel.releaseYear}</p>
            <LikeButton
                initialLikeStatus={initialLikeStatus} // Status like awal
                novelSlug={slug}
                userId={userId}
            />
            <BookmarkButton novelId={novel.id} userId={userId} />
            <ReviewForm seriesId={novel.id} userId={userId} type="novel" />
            <ReviewsList seriesId={novel.id} type="novel" userId={userId} />
        </div>
    );
}
