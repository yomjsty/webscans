import Navbar from "@/components/navbar";

export default function HomepageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="">
            <Navbar />
            {children}
        </div>
    );
}
