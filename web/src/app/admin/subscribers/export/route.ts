import { asc } from "drizzle-orm";
import { getUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";

export async function GET() {
  if (!(await getUser())) return new Response("Unauthorized", { status: 401 });
  const rows = await db.select().from(schema.subscribers).orderBy(asc(schema.subscribers.id));
  const csv = ["email,subscribed_at", ...rows.map((r) => `"${r.email.replace(/"/g, '""')}",${r.createdAt.toISOString()}`)].join("\n");
  return new Response(`﻿${csv}\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
