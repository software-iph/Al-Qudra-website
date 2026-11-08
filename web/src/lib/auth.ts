import { eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db, schema } from "./db";

const COOKIE = "aq_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be set (at least 32 characters)");
  return new TextEncoder().encode(value);
}

export async function createSession(userId: number) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    // HTTPS-only once the site runs on its https:// domain (plain http://IP:port while testing).
    secure: process.env.NODE_ENV === "production" && (process.env.SITE_URL ?? "https://").startsWith("https://"),
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

/** The logged-in dashboard user, or null. Cached for the current request. */
export const getUser = cache(async () => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const id = Number(payload.uid);
    const [user] = await db
      .select({ id: schema.users.id, name: schema.users.name, email: schema.users.email })
      .from(schema.users)
      .where(eq(schema.users.id, id));
    return user ?? null;
  } catch {
    return null;
  }
});

/** Use at the top of every dashboard page and Server Action. */
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/admin/login");
  return user;
}
