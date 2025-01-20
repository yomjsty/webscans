import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

type Session = typeof auth.$Infer.Session;

export default async function authMiddleware(request: NextRequest) {
	const { data: session } = await betterFetch<Session>(
		"/api/auth/get-session",
		{
			baseURL: request.nextUrl.origin,
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
		},
	);

	const url = new URL(request.url);
	const pathname = url.pathname;
	const isAdmin = session?.user.role === "admin";
	const isAuthenticated = !!session;

	// Hanya admin yang bisa mengakses /dashboard, /chapter, /series
	if (
		/^\/(dashboard|chapter|series)/.test(pathname) &&
		!isAdmin
	) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// /login dan /register hanya bisa diakses jika belum login
	if (
		/^\/(login|register)/.test(pathname) &&
		isAuthenticated
	) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// /profile dan /buy hanya bisa diakses jika sudah login
	if (
		/^\/(profile|buy)/.test(pathname) &&
		!isAuthenticated
	) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/chapter/:path*",
		"/series/:path*",
		"/login",
		"/register",
		"/profile/:path*",
		"/buy/:path*",
	],
};
