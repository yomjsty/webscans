import { GalleryVerticalEnd, Menu } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { getServerSession } from "@/actions/getServerSession";
import SearchComponent from "./search-component";
import UserButton from "./user-button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export default async function Navbar() {
    const session = await getServerSession();
    return (
        <nav className="bg-slate-950 border-b border-slate-700">
            <div className="max-w-screen-2xl mx-auto px-6 h-20 flex items-center text-slate-100 gap-4">
                <div className="flex items-center gap-3 md:gap-8 md:mr-4">
                    <div className="">
                        <GalleryVerticalEnd className="size-6" />
                    </div>
                    <div className="">
                        <ul className="hidden md:flex items-center gap-8">
                            <Button
                                variant="ghost"
                                className="hover:bg-slate-800 hover:text-slate-100"
                            >
                                <Link href="/" className="text-sm">
                                    Home
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                className="hover:bg-slate-800 hover:text-slate-100"
                            >
                                <Link href="#">Latest</Link>
                            </Button>
                            <Button
                                variant="ghost"
                                className="hover:bg-slate-800 hover:text-slate-100"
                            >
                                <Link href="/">Most Popular</Link>
                            </Button>
                            {session && (
                                <Button
                                    variant="ghost"
                                    className="hover:bg-slate-800 hover:text-slate-100"
                                >
                                    <Link href="/buy/coins">Store</Link>
                                </Button>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="flex-1">
                    <SearchComponent />
                </div>
                <div className="ml-2 flex gap-4">
                    {session ? (
                        <UserButton user={session.user} />
                    ) : (
                        <Link href="/login">
                            <Button variant="secondary">Login</Button>
                        </Link>
                    )}
                    <Sheet>
                        <SheetTrigger className="block md:hidden">
                            <Menu className="size-5" />
                        </SheetTrigger>
                        <SheetContent className="bg-slate-950 border-slate-950 text-slate-100">
                            <SheetHeader>
                                <SheetTitle className="text-slate-50">
                                    Webscans
                                </SheetTitle>
                                <SheetDescription></SheetDescription>
                            </SheetHeader>
                            <div className="py-6">
                                <ul className="flex flex-col gap-8">
                                    <Link href="/" className="text-sm">
                                        Home
                                    </Link>

                                    <Link href="#" className="text-sm">
                                        Latest
                                    </Link>

                                    <Link href="#" className="text-sm">
                                        Most Popular
                                    </Link>
                                    {session && (
                                        <Link
                                            href="/buy/coins"
                                            className="text-sm"
                                        >
                                            Store
                                        </Link>
                                    )}
                                </ul>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
