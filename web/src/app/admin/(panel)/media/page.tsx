import { asc } from "drizzle-orm";
import { RotateCcw, Upload } from "lucide-react";
import { ConfirmButton, FileInput, SubmitButton } from "@/components/admin/client";
import { Badge, btn, PageHeader } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { replaceMedia, resetMedia } from "../../actions";

export const metadata = { title: "Images & videos" };

export default async function MediaPage() {
  await requireUser();
  const rows = await db.select().from(schema.media).orderBy(asc(schema.media.sort));
  const groups = [...new Set(rows.map((r) => r.group))];

  return (
    <>
      <PageHeader title="Images & videos" text="Every fixed photo and video on the website. Choose a new file and press Replace. Restore puts the original back." />
      {groups.map((group) => (
        <section key={group} className="mb-10">
          <h2 className="mb-4 flex items-center gap-3 text-lg font-extrabold text-navy-900">
            {group}
            <span className="h-px flex-1 bg-line" />
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {rows
              .filter((r) => r.group === group)
              .map((m) => {
                const changed = m.src !== m.defaultSrc;
                const darkBg = m.key === "brand.logo_light";
                return (
                  <div key={m.key} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                    <div className={`flex h-48 items-center justify-center ${darkBg ? "bg-navy-800" : "bg-[repeating-conic-gradient(#eef1f5_0_25%,#f8fafc_0_50%)] bg-[length:18px_18px]"}`}>
                      {m.type === "video" ? (
                        <video src={m.src} className="max-h-48 w-full object-cover" muted controls preload="metadata" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.src} alt={m.label} className="max-h-48 max-w-[85%] object-contain" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-extrabold text-navy-900">{m.label}</h3>
                        {changed && <Badge tone="blue">changed</Badge>}
                      </div>
                      <p className="text-xs text-muted">{m.type === "video" ? "MP4 or WebM, up to 100 MB" : "JPG, PNG, WebP, GIF or AVIF, up to 10 MB"}</p>
                      <form action={replaceMedia} className="mt-auto grid gap-3">
                        <input type="hidden" name="key" value={m.key} />
                        <FileInput name="file" accept={m.type === "video" ? "video/mp4,video/webm" : "image/*"} kind={m.type === "video" ? "video" : "image"} required />
                        <div className="flex gap-2">
                          <SubmitButton className={`${btn.primary} flex-1`} pendingText="Uploading...">
                            <Upload className="size-4" /> Replace
                          </SubmitButton>
                          {changed && (
                            <ConfirmButton formAction={resetMedia} message="Restore the original file?" className={btn.secondary}>
                              <RotateCcw className="size-4" />
                            </ConfirmButton>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      ))}
    </>
  );
}
