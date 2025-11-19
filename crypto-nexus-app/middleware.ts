import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Rutas públicas que NO requieren sesión
  const rutasPublicas = ["/", "/login", "/register", "/register_form"];

  if (rutasPublicas.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Rutas protegidas (cualquier cosa dentro de /dashboard, /inversion, etc.)
  const requiereAuth =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/inversion") ||
    req.nextUrl.pathname.startsWith("/intercambio_p2p") ||
    req.nextUrl.pathname.startsWith("/mis_publicaciones");

  if (!requiereAuth) {
    return NextResponse.next();
  }

  // Llamar a tu backend para verificar la sesión
  try {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: req.headers.get("cookie") || "",
      },
    });

    if (resp.status === 200) {
      // sesión válida → permitir acceso
      return NextResponse.next();
    }

    // sesión inválida → redirigir
    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    // error de conexión → redirigir
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/inversion/:path*",
    "/informacion/:path*",
    "/intercambio_p2p/:path*",
    "/mis_publicaciones/:path*",
  ],
};
