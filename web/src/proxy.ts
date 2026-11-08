import { NextResponse, type NextRequest } from "next/server";
import { isLocale, negotiateLocale } from "@/lib/i18n";

/** Sends visitors without a language in the URL to /ar/... or /en/... */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) return;

  const saved = request.cookies.get("lang")?.value;
  const lang = isLocale(saved) ? saved : negotiateLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip the dashboard, API, uploads, Next internals and files with an extension.
  matcher: ["/((?!admin|api|uploads|_next|.*\\..*).*)"],
};
