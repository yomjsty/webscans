import Link from "next/link";

export default function ProfileLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="p-8">
            <div className="flex flex-col gap-2 pb-4 border-b border-slate-900">
                <div className="text-2xl font-bold">Profile Page</div>
                <p className="text-sm text-muted-foreground">
                    Manage your account and settings
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 w-full pt-4">
                <div className="md:w-72">
                    <ul className="flex md:flex-col gap-4 md:gap-8 py-2">
                        <Link
                            href="/profile/me"
                            className="hover:underline underline-offset-8"
                        >
                            Me
                        </Link>
                        <Link
                            href="/profile/bookmarks"
                            className="hover:underline underline-offset-8"
                        >
                            Bookmarks
                        </Link>
                        <Link
                            href="/profile/likes"
                            className="hover:underline underline-offset-8"
                        >
                            Likes
                        </Link>
                        <Link
                            href="/profile/transaction"
                            className="hover:underline underline-offset-8"
                        >
                            Transactions
                        </Link>
                    </ul>
                </div>
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}
