import { and, count, desc, eq, ilike, isNull, or, type SQL } from "drizzle-orm";
import { FileText, Search } from "lucide-react";
import Link from "next/link";
import { Empty, inputCls, PageHeader } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";

export const metadata = { title: "Job applications" };

const PER_PAGE = 25;
const A = schema.applications;

export default async function ApplicationsPage({ searchParams }: PageProps<"/admin/applications">) {
  await requireUser();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const job = typeof sp.job === "string" ? sp.job : "";
  const page = Math.max(1, Number(sp.page) || 1);

  const filters: SQL[] = [];
  if (q) filters.push(or(ilike(A.name, `%${q}%`), ilike(A.email, `%${q}%`), ilike(A.phone, `%${q}%`), ilike(A.city, `%${q}%`), ilike(A.jobTitle, `%${q}%`))!);
  if (job === "open") filters.push(eq(A.jobTitle, ""));
  else if (Number(job)) filters.push(eq(A.careerId, Number(job)));
  const where = filters.length ? and(...filters) : undefined;

  const [rows, [{ value: total }], [{ value: unread }], jobs] = await Promise.all([
    db.select().from(A).where(where).orderBy(desc(A.createdAt)).limit(PER_PAGE).offset((page - 1) * PER_PAGE),
    db.select({ value: count() }).from(A).where(where),
    db.select({ value: count() }).from(A).where(isNull(A.readAt)),
    db
      .select({ id: schema.careers.id, title: schema.careers.titleEn })
      .from(schema.careers)
      .where(eq(schema.careers.applyMethod, "form"))
      .orderBy(desc(schema.careers.createdAt)),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const link = (p: number) => `/admin/applications?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}${job ? `&job=${job}` : ""}`;

  return (
    <>
      <PageHeader title="Job applications" text={`Sent from the Careers page, with the candidate's CV. ${unread} new.`} />
      <form className="mb-5 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Search name, email, phone or city" className={`${inputCls} max-w-sm`} />
        <select name="job" defaultValue={job} className={`${inputCls} max-w-xs`}>
          <option value="">All jobs</option>
          <option value="open">Open applications</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>
        <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 font-bold ring-1 ring-line hover:bg-paper">
          <Search className="size-4" /> Filter
        </button>
      </form>

      {rows.length === 0 ? (
        <Empty>{q || job ? "No applications match this filter." : "No applications yet. They appear here when candidates apply on the Careers page."}</Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <ul className="divide-y divide-line">
            {rows.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/applications/${a.id}`}
                  className="grid gap-1 px-5 py-4 transition hover:bg-paper sm:grid-cols-[1.3fr_1.5fr_auto] sm:items-center sm:gap-6"
                >
                  <span className="flex items-center gap-3">
                    <span className={`size-2 shrink-0 rounded-full ${a.readAt ? "bg-line" : "bg-red-500"}`} />
                    <span className="min-w-0">
                      <span className={`block truncate ${a.readAt ? "text-navy-900" : "font-extrabold text-navy-900"}`} dir="auto">
                        {a.name}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {a.email} · <span dir="ltr">{a.phone}</span>
                      </span>
                    </span>
                  </span>
                  <span className="flex min-w-0 items-center gap-2 text-sm">
                    <FileText className="size-4 shrink-0 text-navy-600" />
                    <span className="truncate font-bold text-navy-900">{a.jobTitle || "Open application"}</span>
                    {a.city && <span className="truncate text-muted">· {a.city}</span>}
                  </span>
                  <span className="text-xs text-muted">{a.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
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
              href={link(p)}
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
