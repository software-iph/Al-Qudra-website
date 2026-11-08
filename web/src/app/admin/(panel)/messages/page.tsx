import { count, desc, ilike, isNull, or } from "drizzle-orm";
import { Search } from "lucide-react";
import Link from "next/link";
import { Empty, inputCls, PageHeader } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";

export const metadata = { title: "Messages" };

const PER_PAGE = 25;

export default async function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  await requireUser();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const page = Math.max(1, Number(sp.page) || 1);
  const where = q
    ? or(ilike(schema.messages.name, `%${q}%`), ilike(schema.messages.email, `%${q}%`), ilike(schema.messages.message, `%${q}%`), ilike(schema.messages.subject, `%${q}%`))
    : undefined;

  const [rows, [{ value: total }], [{ value: unread }]] = await Promise.all([
    db.select().from(schema.messages).where(where).orderBy(desc(schema.messages.createdAt)).limit(PER_PAGE).offset((page - 1) * PER_PAGE),
    db.select({ value: count() }).from(schema.messages).where(where),
    db.select({ value: count() }).from(schema.messages).where(isNull(schema.messages.readAt)),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <>
      <PageHeader title="Messages" text={`Sent from the Contact page. ${unread} unread.`} />
      <form className="mb-5 flex max-w-md gap-2">
        <input name="q" defaultValue={q} placeholder="Search name, email or text" className={inputCls} />
        <button className="inline-flex items-center rounded-xl bg-white px-4 ring-1 ring-line hover:bg-paper" aria-label="Search">
          <Search className="size-4" />
        </button>
      </form>

      {rows.length === 0 ? (
        <Empty>{q ? "No messages match your search." : "No messages yet."}</Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <ul className="divide-y divide-line">
            {rows.map((m) => (
              <li key={m.id}>
                <Link href={`/admin/messages/${m.id}`} className="grid gap-1 px-5 py-4 transition hover:bg-paper sm:grid-cols-[1.2fr_2fr_auto] sm:items-center sm:gap-6">
                  <span className="flex items-center gap-3">
                    <span className={`size-2 shrink-0 rounded-full ${m.readAt ? "bg-line" : "bg-red-500"}`} />
                    <span className="min-w-0">
                      <span className={`block truncate ${m.readAt ? "text-navy-900" : "font-extrabold text-navy-900"}`}>{m.name}</span>
                      <span className="block truncate text-xs text-muted">{m.email}</span>
                    </span>
                  </span>
                  <span className="truncate text-sm text-muted">
                    {m.subject && <strong className="text-navy-900">{m.subject} · </strong>}
                    {m.message}
                  </span>
                  <span className="text-xs text-muted">{m.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pages > 1 && (
        <div className="mt-5 flex gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/messages?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`flex size-9 items-center justify-center rounded-lg text-sm font-bold ${p === page ? "bg-navy-700 text-white" : "bg-white ring-1 ring-line"}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
