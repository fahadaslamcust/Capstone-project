import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
	const session = request.cookies.get("session");
	if (!session) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
	const headers = new Headers(request.headers);
	headers.set("x-request-id", crypto.randomUUID());

	return NextResponse.next({
		request: {
			headers,
		},
	});
}

export const config = {
	matcher: ["/projects/:path*", "/analytics/:path*"],
};
