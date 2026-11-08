import { desc } from "drizzle-orm";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { ConfirmButton } from "@/components/admin/client";
import { Badge, btn, Empty, PageHeader } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { deleteCareer } from "../../actions";

export const metadata = { title: "Job openings" };

const EMPLOYMENT_LABELS: Record<string, string> = { full_time: "Full time", part_time: "Part time", contract: "Contract", internship: "Internship" };
const LOCATION_LABELS: Record<string, string> = { on_site: "On-site", remote: "Remote", hybrid: "Hybrid" };

export default async function CareersAdminPage() {
  await requireUser();
  const rows = await db.select().from(schema.careers).orderBy(desc(schema.careers.createdAt));

  return (
    <>
      <PageHeader
        title="Job openings"
        text="Positions listed on the Careers page. Applicants send their CV to the careers email set in Settings."
        actions={
          <Link href="/admin/careers/new" className={btn.primary}>
            <Plus className="size-4" /> Post a job
          </Link>
        }
      />
      {rows.length === 0 ? (
        <Empty>
          No job openings yet. The Careers page invites people to send their CV instead.
          <div className="mt-4">
            <Link href="/admin/careers/new" className={btn.primary}>
              <Plus className="size-4" /> Post the first job
            </Link>
          </div>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-paper text-start text-xs font-bold tracking-wider text-muted uppercase">
              <tr>
                <th className="px-5 py-3 text-start">Title</th>
                <th className="px-5 py-3 text-start">Type</th>
                <th className="px-5 py-3 text-start">Posted</th>
                <th className="px-5 py-3 text-start">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((job) => (
                <tr key={job.id} className="hover:bg-paper/60">
                  <td className="px-5 py-4">
                    <p className="font-extrabold text-navy-900">{job.titleEn}</p>
                    <p className="text-muted" dir="rtl">
                      {job.titleAr}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {EMPLOYMENT_LABELS[job.employment]} · {LOCATION_LABELS[job.location]}
                    {job.city && ` · ${job.city}`}
                  </td>
                  <td className="px-5 py-4 text-muted">{job.createdAt.toLocaleDateString("en-GB")}</td>
                  <td className="px-5 py-4">
                    <Badge tone={job.active ? "green" : "slate"}>{job.active ? "Open" : "Closed"}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/careers/${job.id}`} className={btn.secondary}>
                        <Pencil className="size-4" />
                      </Link>
                      <form action={deleteCareer}>
                        <input type="hidden" name="id" value={job.id} />
                        <ConfirmButton message={`Delete "${job.titleEn}"?`}>
                          <Trash2 className="size-4" />
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
