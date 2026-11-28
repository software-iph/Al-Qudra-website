import { jwtVerify, SignJWT } from "jose";

/*
 * Dashboard session token (no database access here, so the proxy can use it too).
 * IPH Website Standards C6: automatic logout when idle. The token carries the time of the
 * last activity ("lat"); the proxy refreshes it while the person keeps working.
 */
export const SESSION_COOKIE = "aq_session";
export const IDLE_MINUTES = 60; // logged out after 60 minutes without activity
export const MAX_HOURS = 12; // and after 12 hours in any case
const REFRESH_AFTER_MS = 5 * 60_000;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be set (at least 32 characters)");
  return new TextEncoder().encode(value);
}

export type Session = { uid: number; lat: number; iat: number };

export async function signSession(uid: number, issuedAt?: number) {
  const now = Math.floor(Date.now() / 1000);
  const iat = issuedAt ?? now;
  return new SignJWT({ uid, lat: now })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(iat)
    .setExpirationTime(iat + MAX_HOURS * 3600)
    .sign(secret());
}

/** The session if the token is valid and not idle for too long, else null. */
export async function readSession(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const uid = Number(payload.uid);
    const lat = Number(payload.lat ?? payload.iat);
    if (!uid || Date.now() / 1000 - lat > IDLE_MINUTES * 60) return null;
    return { uid, lat, iat: Number(payload.iat) };
  } catch {
    return null;
  }
}

/** True when the last-activity time is old enough to be worth refreshing. */
export const needsRefresh = (s: Session) => Date.now() - s.lat * 1000 > REFRESH_AFTER_MS;

export const cookieOptions = () => ({
  httpOnly: true,
  // HTTPS-only once the site runs on its https:// domain (plain http:// while testing).
  secure: process.env.NODE_ENV === "production" && (process.env.SITE_URL ?? "https://").startsWith("https://"),
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_HOURS * 3600,
});
