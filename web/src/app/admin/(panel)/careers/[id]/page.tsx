import { eq } from "drizzle-orm";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubmitButton } from "@/components/admin/client";
import { btn, Field, inputCls, PageHeader, Panel } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { saveCareer } from "../../../actions";

const EMPLOYMENT = { full_time: "Full time", part_time: "Part time", contract: "Contract", internship: "Internship" };
const LOCATION = { on_site: "On-site", remote: "Remote", hybrid: "Hybrid" };

export default async function CareerEditPage({ params }: PageProps<"/admin/careers/[id]">) {
  await requireUser();
  const { id } = await params;
  const isNew = id === "new";
  const [row] = isNew ? [] : await db.select().from(schema.careers).where(eq(schema.careers.id, Number(id)));
  if (!isNew && !row) notFound();
  const job = row ?? { id: 0, titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "", employment: "full_time", location: "on_site", city: "Benghazi", active: true };

  return (
    <>
      <PageHeader
        title={isNew ? "Post a job" : "Edit job opening"}
        actions={
          <Link href="/admin/careers" className={btn.secondary}>
            <ArrowLeft className="size-4" /> Back
          </Link>
        }
      />
      <form action={saveCareer} className="grid gap-6">
        <input type="hidden" name="id" value={job.id} />
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="English">
            <div className="grid gap-4">
              <Field label="Job title *">
                <input name="titleEn" required defaultValue={job.titleEn} placeholder="e.g. Site Engineer" className={inputCls} />
              </Field>
              <Field label="Description" hint="Responsibilities, requirements...">
                <textarea name="descriptionEn" rows={8} defaultValue={job.descriptionEn} className={inputCls} />
              </Field>
            </div>
          </Panel>
          <Panel title="Arabic · العربية">
            <div className="grid gap-4" dir="rtl">
              <Field label="المسمى الوظيفي">
                <input name="titleAr" defaultValue={job.titleAr} placeholder="مثال: مهندس موقع" className={inputCls} />
              </Field>
              <Field label="الوصف">
                <textarea name="descriptionAr" rows={8} defaultValue={job.descriptionAr} className={inputCls} />
              </Field>
            </div>
          </Panel>
        </div>
        <Panel title="Details">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Employment type">
              <select name="employment" defaultValue={job.employment} className={inputCls}>
                {Object.entries(EMPLOYMENT).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Work location">
              <select name="location" defaultValue={job.location} className={inputCls}>
                {Object.entries(LOCATION).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="City">
              <input name="city" defaultValue={job.city} className={inputCls} />
            </Field>
            <label className="flex items-center gap-2 pt-7 text-sm font-bold text-navy-900">
              <input type="checkbox" name="active" defaultChecked={job.active} className="size-4 accent-navy-700" /> Open (shown on the website)
            </label>
          </div>
        </Panel>
        <div className="flex justify-end">
          <SubmitButton className={`${btn.primary} px-6 py-3`}>
            <Save className="size-4" /> Save job opening
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
