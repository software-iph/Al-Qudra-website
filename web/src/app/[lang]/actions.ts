"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db, schema } from "@/lib/db";

export type FormState = { ok: boolean; error?: "invalid" | "error" | "busy"; fields?: string[] } | null;

// Small in-memory rate limit: 5 submissions per 10 minutes per IP and form.
const hits = new Map<string, number[]>();
async function limited(form: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
  const key = `${form}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > 5;
}

const contactSchema = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.email().max(200),
  phone: z.string().trim().max(50).optional().default(""),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(5).max(5000),
});

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website")) return { ok: true }; // honeypot: bots fill hidden fields
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: "invalid", fields: parsed.error.issues.map((i) => String(i.path[0])) };
  }
  if (await limited("contact")) return { ok: false, error: "busy" };
  try {
    await db.insert(schema.messages).values(parsed.data);
    return { ok: true };
  } catch (e) {
    console.error("[contact]", e);
    return { ok: false, error: "error" };
  }
}

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website")) return { ok: true };
  const parsed = z.object({ email: z.email().max(200) }).safeParse({ email: String(formData.get("email") ?? "").trim().toLowerCase() });
  if (!parsed.success) return { ok: false, error: "invalid", fields: ["email"] };
  if (await limited("subscribe")) return { ok: false, error: "busy" };
  try {
    await db.insert(schema.subscribers).values(parsed.data).onConflictDoNothing();
    return { ok: true };
  } catch (e) {
    console.error("[subscribe]", e);
    return { ok: false, error: "error" };
  }
}
