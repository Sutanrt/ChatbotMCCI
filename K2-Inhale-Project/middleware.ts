import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // lewati asset
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    /\.(png|jpg|jpeg|svg|webp|css|js|ico)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // contoh guard ringan: hanya cek keberadaan cookie session
  const sessionCookie =
    req.cookies.get("__Secure-next-auth.session-token")?.value ??
    req.cookies.get("next-auth.session-token")?.value ??
    req.cookies.get("session")?.value;

  // bebasin halaman login/register/landing
  const isPublic = ["/", "/login", "/register", "/landing"].includes(pathname);

  if (!sessionCookie && !isPublic) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|static|favicon\\.ico|favicon\\.png|sitemap\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|svg|webp|css|js|ico)).*)',
  ],
};

// import { type NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import { guestRegex, isDevelopmentEnvironment } from "./lib/constants.edge";

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   /*
//    * Playwright starts the dev server and requires a 200 status to
//    * begin the tests, so this ensures that the tests can start
//    */
//   if (pathname.startsWith("/ping")) {
//     return new Response("pong", { status: 200 });
//   }

//   if (pathname.startsWith("/api/auth")) {
//     return NextResponse.next();
//   }

//   const token = await getToken({
//     req: request,
//     secret: process.env.AUTH_SECRET,
//     secureCookie: !isDevelopmentEnvironment,
//   });

//   if (!token) {
//     const redirectUrl = encodeURIComponent(request.url);

//     return NextResponse.redirect(
//       new URL(`/api/auth/guest?redirectUrl=${redirectUrl}`, request.url)
//     );
//   }

//   const isGuest = guestRegex.test(token?.email ?? "");

//   if (token && !isGuest && ["/login", "/register"].includes(pathname)) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/",
//     "/chat/:id",
//     "/api/:path*",
//     "/login",
//     "/register",

//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico, sitemap.xml, robots.txt (metadata files)
//      */
//     "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };
