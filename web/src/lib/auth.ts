import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db, schema } from "./db";
import { cookieOptions, readSession, SESSION_COOKIE, signSession } from "./session";

export async function createSession(userId: number) {
  (await cookies()).set(SESSION_COOKIE, await signSession(userId), cookieOptions());
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** The logged-in dashboard user, or null (also null after 60 idle minutes). Cached for the current request. */
export const getUser = cache(async () => {
  const session = await readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const [user] = await db
    .select({ id: schema.users.id, name: schema.users.name, email: schema.users.email })
    .from(schema.users)
    .where(eq(schema.users.id, session.uid));
  return user ?? null;
});

/** Use at the top of every dashboard page and Server Action. */
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/admin/login");
  return user;
}

// ---------- login attempts (IPH C6: repeated wrong passwords are blocked) ----------

const WINDOW_MS = 15 * 60_000;
const MAX_FAILS = 5;
declare global {
  var __aqLoginFails: Map<string, number[]> | undefined;
}
const fails = (globalThis.__aqLoginFails ??= new Map<string, number[]>());

const recent = (key: string) => (fails.get(key) ?? []).filter((t) => Date.now() - t < WINDOW_MS);

/** Minutes left while this email or address is blocked, or 0. */
export function loginBlocked(keys: string[]) {
  for (const key of keys) {
    const r = recent(key);
    if (r.length >= MAX_FAILS) return Math.max(1, Math.ceil((r[0] + WINDOW_MS - Date.now()) / 60_000));
  }
  return 0;
}

export function loginFailed(keys: string[]) {
  for (const key of keys) fails.set(key, [...recent(key), Date.now()]);
}

export function loginSucceeded(keys: string[]) {
  for (const key of keys) fails.delete(key);
}
