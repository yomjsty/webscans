import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getUserId = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
        return redirect("/");
    }
    return session;
};