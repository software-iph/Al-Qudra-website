import { asc } from "drizzle-orm";
import { ArrowRightLeft, RotateCcw, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { ConfirmButton, FileInput, SubmitButton } from "@/components/admin/client";
import { LibraryPicker, Thumb, type PickerFile } from "@/components/admin/MediaLibrary";
import { Badge, btn, inputCls, PageHeader } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { libraryUsage, listLibrary } from "@/lib/library";
import { assignMedia, deleteLibraryFile, replaceMedia, resetMedia, uploadToLibrary } from "../../actions";

export const metadata = { title: "Images & videos" };

const SHOW = { all: "All", image: "Photos", video: "Videos", uploaded: "My uploads", unused: "Not used" } as const;
type Show = keyof typeof SHOW;

const fileName = (src: string) => decodeURIComponent(src.split("/").pop() ?? src);
const sizeLabel = (bytes: number) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

export default async function MediaPage({ searchParams }: PageProps<"/admin/media">) {
  await requireUser();
  const sp = await searchParams;
  const show: Show = typeof sp.show === "string" && sp.show in SHOW ? (sp.show as Show) : "all";

  const [rows, library, usage] = await Promise.all([db.select().from(schema.media).orderBy(asc(schema.media.sort)), listLibrary(), libraryUsage()]);
  const groups = [...new Set(rows.map((r) => r.group))];
  const pickerFiles: PickerFile[] = library.map(({ src, name, type, uploaded }) => ({ src, name, type, uploaded }));
  const slotsFor = (type: "image" | "video") => rows.filter((r) => (r.type === "video" ? "video" : "image") === type);

  const shown = library.filter((f) =>
    show === "all" ? true : show === "uploaded" ? f.uploaded : show === "unused" ? !usage.get(f.src)?.length : f.type === show,
  );

  return (
    <>
      <PageHeader
        title="Images & videos"
        text="Every fixed photo and video on the website. For each spot, choose a file that is already in the library or upload a new one. Nothing is deleted when you switch: old files stay in the library below."
        actions={
          <a href="#library" className={btn.secondary}>
            Go to library ↓
          </a>
        }
      />

      {/* ---------- Spots on the website ---------- */}
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
                const type = m.type === "video" ? "video" : "image";
                const changed = m.src !== m.defaultSrc;
                const darkBg = m.key === "brand.logo_light";
                return (
                  <div key={m.key} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                    <div className={`flex h-48 items-center justify-center ${darkBg ? "bg-navy-800" : "bg-[repeating-conic-gradient(#eef1f5_0_25%,#f8fafc_0_50%)] bg-[length:18px_18px]"}`}>
                      {type === "video" ? (
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
                      <p className="truncate text-xs text-muted" title={m.src}>
                        Now: {fileName(m.src)}
                      </p>

                      <div className="mt-auto flex gap-2">
                        <LibraryPicker slotKey={m.key} slotLabel={m.label} type={type} current={m.src} files={pickerFiles} />
                        {changed && (
                          <form action={resetMedia}>
                            <input type="hidden" name="key" value={m.key} />
                            <ConfirmButton message="Put the original file back?" className={btn.secondary}>
                              <RotateCcw className="size-4" />
                            </ConfirmButton>
                          </form>
                        )}
                      </div>

                      <details className="group rounded-xl border border-line">
                        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-sm font-bold text-navy-700">
                          <Upload className="size-4" /> Upload new
                          <span className="ms-auto text-xs font-normal text-muted">{type === "video" ? "MP4/WebM, 100 MB" : "JPG/PNG/WebP, 10 MB"}</span>
                        </summary>
                        <form action={replaceMedia} className="grid gap-3 border-t border-line p-4">
                          <input type="hidden" name="key" value={m.key} />
                          <FileInput name="file" accept={type === "video" ? "video/mp4,video/webm" : "image/*"} kind={type} required />
                          <SubmitButton className={btn.primary} pendingText="Uploading...">
                            <Upload className="size-4" /> Upload and use here
                          </SubmitButton>
                        </form>
                      </details>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      ))}

      {/* ---------- Library ---------- */}
      <section id="library" className="scroll-mt-24 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-navy-900">Library</h2>
            <p className="mt-1 text-sm text-muted">
              {library.length} files — the photos and videos that came with the website plus everything uploaded. Use any of them anywhere.
            </p>
          </div>
        </div>

        {/* Upload to the library */}
        <form action={uploadToLibrary} className="mt-6 grid gap-4 rounded-xl border border-dashed border-navy-700/25 bg-paper p-5 lg:grid-cols-[1fr_auto_auto] lg:items-end">
          <FileInput name="files" accept="image/*,video/mp4,video/webm" multiple required />
          <label className="grid gap-1.5 text-sm font-bold text-navy-900">
            Use the first file for (optional)
            <select name="key" defaultValue="" className={inputCls}>
              <option value="">Just add to the library</option>
              {groups.map((g) => (
                <optgroup key={g} label={g}>
                  {rows
                    .filter((r) => r.group === g)
                    .map((r) => (
                      <option key={r.key} value={r.key}>
                        {r.label} ({r.type === "video" ? "video" : "photo"})
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
          <SubmitButton className={btn.primary} pendingText="Uploading...">
            <Upload className="size-4" /> Upload
          </SubmitButton>
        </form>

        {/* Filters */}
        <nav className="mt-6 flex flex-wrap gap-2">
          {(Object.keys(SHOW) as Show[]).map((k) => (
            <Link
              key={k}
              href={`/admin/media?show=${k}#library`}
              scroll={false}
              className={`rounded-full px-4 py-1.5 text-sm font-bold ring-1 transition ${show === k ? "bg-navy-700 text-white ring-navy-700" : "bg-white text-navy-900 ring-line hover:bg-paper"}`}
            >
              {SHOW[k]}
            </Link>
          ))}
        </nav>

        {/* Files */}
        {shown.length === 0 ? (
          <p className="py-14 text-center text-muted">Nothing here.</p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {shown.map((f) => {
              const where = usage.get(f.src) ?? [];
              const slots = slotsFor(f.type);
              return (
                <div key={f.src} className="flex flex-col overflow-hidden rounded-xl border border-line">
                  <div className="relative aspect-[4/3] bg-[repeating-conic-gradient(#eef1f5_0_25%,#f8fafc_0_50%)] bg-[length:18px_18px]">
                    <Thumb file={f} />
                    <span className="absolute top-2 start-2 flex gap-1">
                      {f.type === "video" && <Badge tone="slate">video</Badge>}
                      {f.uploaded ? <Badge tone="blue">uploaded</Badge> : <Badge tone="slate">built-in</Badge>}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <p className="truncate text-sm font-bold text-navy-900" title={f.src}>
                      {f.name}
                    </p>
                    <p className="text-xs text-muted">{sizeLabel(f.size)}</p>
                    <p className="text-xs text-muted">
                      {where.length ? (
                        <>
                          <span className="font-bold text-emerald-700">Used in:</span> {where.join(" · ")}
                        </>
                      ) : (
                        "Not used on the website"
                      )}
                    </p>

                    <form action={assignMedia} className="mt-auto flex gap-2 pt-2">
                      <input type="hidden" name="src" value={f.src} />
                      <input type="hidden" name="back" value="library" />
                      <select name="key" required defaultValue="" className={`${inputCls} min-w-0 flex-1 !py-2 text-sm`} aria-label="Use this file for">
                        <option value="" disabled>
                          Use for…
                        </option>
                        {slots.map((r) => (
                          <option key={r.key} value={r.key} disabled={r.src === f.src}>
                            {r.group}: {r.label}
                            {r.src === f.src ? " (in use)" : ""}
                          </option>
                        ))}
                      </select>
                      <SubmitButton className={`${btn.primary} !px-3`} pendingText="...">
                        <ArrowRightLeft className="size-4" />
                        <span className="sr-only">Use</span>
                      </SubmitButton>
                      {f.uploaded && !where.length && (
                        <ConfirmButton formAction={deleteLibraryFile} message={`Delete ${f.name}? This cannot be undone.`}>
                          <Trash2 className="size-4" />
                        </ConfirmButton>
                      )}
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
