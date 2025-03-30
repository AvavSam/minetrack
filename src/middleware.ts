import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Rute yang memerlukan autentikasi
  const protectedPaths = ["/dashboard", "/admin", "/pengajuan-tambang"];

  // Rute khusus admin
  const adminPaths = ["/admin"];

  // Cek apakah path saat ini termasuk dalam rute yang dilindungi
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`));

  // Cek apakah path saat ini termasuk dalam rute admin
  const isAdminPath = adminPaths.some((path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`));

  // Redirect ke login jika tidak ada token dan path dilindungi
  if (!token && isProtectedPath) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect ke dashboard jika user bukan admin tapi mencoba akses rute admin
  if (token && isAdminPath && token.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect ke dashboard jika sudah login dan mencoba mengakses halaman login/register
  if (token && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
    // Redirect berdasarkan role
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register", "/pengajuan-tambang"],
};
