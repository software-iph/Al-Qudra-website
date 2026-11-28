import { NextResponse, type NextRequest } from "next/server";
import { isLocale, negotiateLocale } from "@/lib/i18n";
import { cookieOptions, needsRefresh, readSession, SESSION_COOKIE, signSession } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dashboard: keep an active session alive (sliding 60-minute idle timeout), drop an idle one.
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return;
    const session = await readSession(token);
    const res = NextResponse.next();
    if (!session) res.cookies.delete(SESSION_COOKIE);
    else if (needsRefresh(session)) res.cookies.set(SESSION_COOKIE, await signSession(session.uid, session.iat), cookieOptions());
    return res;
  }

  // Public site: visitors without a language in the URL go to /ar/... or /en/...
  const first = pathname.split("/")[1];
  if (isLocale(first)) return;
  const saved = request.cookies.get("lang")?.value;
  const lang = isLocale(saved) ? saved : negotiateLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip the API, uploads, Next internals and files with an extension (sitemap.xml, robots.txt...).
  matcher: ["/((?!api|uploads|_next|.*\..*).*)"],
};
