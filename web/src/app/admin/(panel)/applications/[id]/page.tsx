import { and, eq, isNull } from "drizzle-orm";
import { ArrowLeft, Download, Eye, Link2, Mail, MailOpen, MapPin, Phone, Reply, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/client";
import { btn, PageHeader, Panel } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { APPLICATION_STATUS } from "@/lib/status";
import { deleteApplication, markApplicationUnread, setApplicationStatus } from "../../../actions";

export default async function ApplicationPage({ params }: PageProps<"/admin/applications/[id]">) {
  await requireUser();
  const id = Number((await params).id);
  const A = schema.applications;
  const [a] = await db.select().from(A).where(eq(A.id, id));
  if (!a) notFound();
  // Opening a new application marks it read and "reviewed".
  if (!a.readAt) {
    await db.update(A).set({ readAt: new Date(), status: a.status === "new" ? "reviewed" : a.status }).where(and(eq(A.id, id), isNull(A.readAt)));
    if (a.status === "new") a.status = "reviewed";
  }
  const job = a.jobTitle || "Open application";
  const isPdf = a.cvFile.endsWith(".pdf");
  const cvUrl = `/admin/applications/${a.id}/cv`;

  return (
    <>
      <PageHeader
        title={a.name}
        text={`Applied for: ${job} · ${a.createdAt.toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}`}
        actions={
          <Link href="/admin/applications" className={btn.secondary}>
            <ArrowLeft className="size-4" /> All applications
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid content-start gap-6 lg:col-span-2">
          <Panel title="CV">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="min-w-0 truncate font-bold text-navy-900" dir="auto">
                {a.cvName}
              </p>
              <div className="flex gap-2">
                {isPdf && (
                  <a href={`${cvUrl}?view=1`} target="_blank" rel="noopener" className={btn.secondary}>
                    <Eye className="size-4" /> Open
                  </a>
                )}
                <a href={cvUrl} className={btn.primary}>
                  <Download className="size-4" /> Download
                </a>
              </div>
            </div>
            {isPdf && <iframe src={`${cvUrl}?view=1`} title="CV" className="mt-5 h-[70vh] w-full rounded-xl border border-line" />}
          </Panel>
          {a.message && (
            <Panel title="About the candidate">
              <p className="text-[16px] leading-8 whitespace-pre-wrap text-ink" dir="auto">
                {a.message}
              </p>
            </Panel>
          )}
        </div>
        <Panel title="Candidate" className="h-fit">
          <div className="grid gap-4 text-sm">
            <p className="text-lg font-extrabold text-navy-900" dir="auto">
              {a.name}
            </p>
            <a href={`mailto:${a.email}`} className="flex items-center gap-2 text-navy-700 hover:underline">
              <Mail className="size-4" /> {a.email}
            </a>
            <a href={`tel:${a.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2 text-navy-700 hover:underline">
              <Phone className="size-4" /> <span dir="ltr">{a.phone}</span>
            </a>
            {a.city && (
              <p className="flex items-center gap-2 text-ink">
                <MapPin className="size-4" /> {a.city}
              </p>
            )}
            {a.link && (
              <a href={a.link} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-2 break-all text-navy-700 hover:underline">
                <Link2 className="size-4 shrink-0" /> {a.link}
              </a>
            )}
            <form action={setApplicationStatus} className="grid gap-2 border-t border-line pt-4">
              <input type="hidden" name="id" value={a.id} />
              <span className="text-sm font-bold text-navy-900">Status</span>
              <div className="grid grid-cols-2 gap-2">
                {APPLICATION_STATUS.map((s) => (
                  <button
                    key={s}
                    name="status"
                    value={s}
                    aria-pressed={a.status === s}
                    className={`rounded-xl px-3 py-2 text-sm font-bold capitalize ring-1 transition ${
                      a.status === s ? "bg-navy-700 text-white ring-navy-700" : "bg-white text-navy-800 ring-line hover:bg-paper"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </form>
            <div className="flex flex-wrap gap-2 border-t border-line pt-4">
              <a href={`mailto:${a.email}?subject=${encodeURIComponent(`Your application: ${job} - ALQUDRA`)}`} className={`${btn.primary} flex-1`}>
                <Reply className="size-4" /> Reply
              </a>
              <form action={markApplicationUnread}>
                <input type="hidden" name="id" value={a.id} />
                <button className={btn.secondary} title="Mark as unread" aria-label="Mark as unread">
                  <MailOpen className="size-4" />
                </button>
              </form>
              <form action={deleteApplication}>
                <input type="hidden" name="id" value={a.id} />
                <ConfirmButton message="Delete this application and its CV?">
                  <Trash2 className="size-4" />
                </ConfirmButton>
              </form>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
