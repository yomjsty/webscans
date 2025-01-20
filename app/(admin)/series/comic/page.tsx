import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function page() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <div className="text-2xl font-bold">Comic Series Page</div>
                <Button className="ml-auto">
                    <Link href="#">Create Comic Series</Link>
                </Button>
            </div>
        </div>
    );
}
