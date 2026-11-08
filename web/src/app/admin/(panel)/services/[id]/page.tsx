import { eq } from "drizzle-orm";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileInput, SubmitButton } from "@/components/admin/client";
import { IconPicker } from "@/components/admin/IconPicker";
import { btn, Field, inputCls, PageHeader, Panel } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { saveService } from "../../../actions";

export default async function ServiceEditPage({ params }: PageProps<"/admin/services/[id]">) {
  await requireUser();
  const { id } = await params;
  const isNew = id === "new";
  const [row] = isNew ? [] : await db.select().from(schema.services).where(eq(schema.services.id, Number(id)));
  if (!isNew && !row) notFound();
  const s = row ?? { id: 0, titleEn: "", titleAr: "", summaryEn: "", summaryAr: "", pointsEn: "", pointsAr: "", image: "", icon: "hard-hat", sort: 99, active: true };

  return (
    <>
      <PageHeader
        title={isNew ? "Add service" : "Edit service"}
        actions={
          <Link href="/admin/services" className={btn.secondary}>
            <ArrowLeft className="size-4" /> Back
          </Link>
        }
      />
      <form action={saveService} className="grid gap-6">
        <input type="hidden" name="id" value={s.id} />
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="English">
            <div className="grid gap-4">
              <Field label="Title *">
                <input name="titleEn" required defaultValue={s.titleEn} className={inputCls} />
              </Field>
              <Field label="Short description">
                <textarea name="summaryEn" rows={3} defaultValue={s.summaryEn} className={inputCls} />
              </Field>
              <Field label="Bullet points" hint="One per line">
                <textarea name="pointsEn" rows={6} defaultValue={s.pointsEn} className={inputCls} />
              </Field>
            </div>
          </Panel>
          <Panel title="Arabic · العربية">
            <div className="grid gap-4" dir="rtl">
              <Field label="العنوان">
                <input name="titleAr" defaultValue={s.titleAr} className={inputCls} />
              </Field>
              <Field label="وصف مختصر">
                <textarea name="summaryAr" rows={3} defaultValue={s.summaryAr} className={inputCls} />
              </Field>
              <Field label="النقاط" hint="سطر لكل نقطة - إذا تُركت فارغة تظهر النقاط الإنجليزية">
                <textarea name="pointsAr" rows={6} defaultValue={s.pointsAr} className={inputCls} />
              </Field>
            </div>
          </Panel>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Image">
            <FileInput name="image" accept="image/*" current={s.image || undefined} required={isNew} />
          </Panel>
          <Panel title="Display">
            <div className="grid gap-5">
              <Field label="Icon">
                <IconPicker name="icon" value={s.icon} />
              </Field>
              <div className="flex flex-wrap items-end gap-6">
                <Field label="Order" hint="Lower numbers come first">
                  <input type="number" name="sort" min={0} defaultValue={s.sort} className={`${inputCls} w-28`} />
                </Field>
                <label className="flex items-center gap-2 pb-7 text-sm font-bold text-navy-900">
                  <input type="checkbox" name="active" defaultChecked={s.active} className="size-4 accent-navy-700" /> Shown on the website
                </label>
              </div>
            </div>
          </Panel>
        </div>
        <div className="flex justify-end">
          <SubmitButton className={`${btn.primary} px-6 py-3`}>
            <Save className="size-4" /> Save service
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
