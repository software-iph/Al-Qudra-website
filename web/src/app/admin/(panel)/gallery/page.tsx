import { asc } from "drizzle-orm";
import { Check, Trash2, Upload } from "lucide-react";
import { ConfirmButton, FileInput, SubmitButton } from "@/components/admin/client";
import { btn, Empty, inputCls, PageHeader, Panel } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { deleteGalleryItem, updateGalleryItem, uploadGallery } from "../../actions";

export const metadata = { title: "Gallery" };

export default async function GalleryAdminPage() {
  await requireUser();
  const rows = await db.select().from(schema.gallery).orderBy(asc(schema.gallery.sort), asc(schema.gallery.id));

  return (
    <>
      <PageHeader title="Gallery" text={`Photos on the Gallery page and the home page strip (${rows.length} photos). Lower order numbers come first; hidden photos are kept but not shown.`} />
      <Panel className="mb-8">
        <form action={uploadGallery} className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <Field label="Add photos" hint="Select several at once · JPG, PNG, WebP · up to 10 MB each">
            <FileInput name="images" accept="image/*" multiple required />
          </Field>
          <SubmitButton pendingText="Uploading..." className={`${btn.primary} py-3`}>
            <Upload className="size-4" /> Upload
          </SubmitButton>
        </form>
      </Panel>

      {rows.length === 0 ? (
        <Empty>The gallery is empty. Upload some photos above.</Empty>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((g) => (
            <div key={g.id} className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${g.active ? "border-line" : "border-amber-300"}`}>
              <a href={g.src} target="_blank" rel="noopener" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt="" loading="lazy" className={`aspect-[4/3] w-full object-cover ${g.active ? "" : "opacity-40"}`} />
              </a>
              <form action={updateGalleryItem} className="grid gap-2 p-4">
                <input type="hidden" name="id" value={g.id} />
                <input name="captionEn" defaultValue={g.captionEn} placeholder="Caption (English, optional)" className={`${inputCls} py-2 text-sm`} />
                <input name="captionAr" defaultValue={g.captionAr} placeholder="التعليق (اختياري)" dir="rtl" className={`${inputCls} py-2 text-sm`} />
                <div className="flex items-center gap-3 text-sm">
                  <label className="flex items-center gap-1.5 text-muted">
                    Order <input type="number" name="sort" min={0} defaultValue={g.sort} className={`${inputCls} w-16 px-2 py-1.5 text-sm`} />
                  </label>
                  <label className="ms-auto flex items-center gap-1.5 font-bold text-navy-900">
                    <input type="checkbox" name="active" defaultChecked={g.active} className="size-4 accent-navy-700" /> Shown
                  </label>
                </div>
                <div className="flex justify-between gap-2 pt-1">
                  <SubmitButton className={`${btn.primary} px-3 py-2`}>
                    <Check className="size-4" /> Save
                  </SubmitButton>
                  <ConfirmButton formAction={deleteGalleryItem} message="Delete this photo permanently?">
                    <Trash2 className="size-4" />
                  </ConfirmButton>
                </div>
              </form>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <span className="text-sm font-bold text-navy-900">{label}</span>
      {children}
      <span className="text-xs text-muted">{hint}</span>
    </div>
  );
}
