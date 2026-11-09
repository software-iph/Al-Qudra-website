import { readFile } from "node:fs/promises";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { cvPath } from "@/lib/uploads";

const TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** Candidate CVs: dashboard users only. ?view=1 opens PDFs in the browser instead of downloading. */
export async function GET(request: Request, ctx: RouteContext<"/admin/applications/[id]/cv">) {
  await requireUser();
  const id = Number((await ctx.params).id);
  const [a] = await db.select().from(schema.applications).where(eq(schema.applications.id, id));
  const file = a ? cvPath(a.cvFile) : null;
  const data = file ? await readFile(file).catch(() => null) : null;
  if (!a || !data) return new Response("CV not found", { status: 404 });

  const ext = a.cvFile.split(".").pop() ?? "";
  const inline = ext === "pdf" && new URL(request.url).searchParams.has("view");
  const ascii = a.cvName.replace(/[^\x20-\x7e]|"/g, "_");
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": TYPES[ext] ?? "application/octet-stream",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(a.cvName)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
