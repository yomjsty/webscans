"use client";

import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookmarkCheck, CreditCard, Heart, LogOut, User2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserButtonProps {
    user: {
        name: string;
        image?: string | null;
    };
}

export default function UserButton({ user }: UserButtonProps) {
    const router = useRouter();

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="text-slate-950">
                            {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/profile/me" className="">
                        <DropdownMenuItem className="hover:cursor-pointer">
                            <User2 />
                            Profile
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/profile/bookmarks" className="">
                        <DropdownMenuItem className="hover:cursor-pointer">
                            <BookmarkCheck />
                            Bookmarks
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/profile/likes" className="">
                        <DropdownMenuItem className="hover:cursor-pointer">
                            <Heart />
                            Likes
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/profile/transaction" className="">
                        <DropdownMenuItem className="hover:cursor-pointer">
                            <CreditCard />
                            Transactions
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={async () => {
                            await authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        router.push("/");
                                    },
                                },
                            });
                        }}
                        className="hover:cursor-pointer"
                    >
                        <LogOut />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
