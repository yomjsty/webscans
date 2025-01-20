import { getServerSession } from "@/actions/getServerSession";
import db from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { formatDistanceToNow } from "date-fns";

export default async function LikesPage() {
    const session = await getServerSession();
    if (!session) {
        return null;
    }

    const myLikes = await db.like.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            novel: {
                select: {
                    title: true,
                    slug: true,
                    coverImage: true,
                    chapters: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        select: {
                            createdAt: true,
                        },
                    },
                },
            },
        },
    });

    return (
        <div>
            <div className="flex flex-col gap-2 pb-4 border-b border-slate-900">
                <div className="text-2xl font-bold">My Likes</div>
            </div>
            <div className="text-slate-100 py-6">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {myLikes.map((like) => {
                        const lastChapter = like.novel?.chapters[0];
                        return (
                            <Link
                                key={like.id}
                                href={`/novel/${like.novel?.slug}`}
                                className="group relative block"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                                    <Image
                                        src={
                                            like.novel?.coverImage ||
                                            "/placeholder.svg"
                                        }
                                        alt={like.novel?.title || "Novel Cover"}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h2 className="text-sm font-medium line-clamp-2 mb-1">
                                            {like.novel?.title}
                                        </h2>
                                        <div className="flex items-center gap-2 text-xs text-gray-300 flex-wrap">
                                            <span>
                                                Chapter{" "}
                                                {like.novel?.chapters.length ||
                                                    "-"}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {lastChapter?.createdAt
                                                    ? formatDistanceToNow(
                                                          new Date(
                                                              lastChapter.createdAt
                                                          ),
                                                          { addSuffix: true }
                                                      )
                                                    : "No chapters yet"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
