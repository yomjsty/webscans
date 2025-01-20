import { getServerSession } from "@/actions/getServerSession";
import ProfileForm from "@/components/profile-form";
import React from "react";

export default async function page() {
    const session = await getServerSession();
    if (!session) {
        return null;
    }

    return (
        <div>
            <div className="flex flex-col gap-2 pb-4 border-b border-slate-900">
                <div className="text-2xl font-bold">My Profile</div>
            </div>
            <ProfileForm user={session.user} />
        </div>
    );
}
