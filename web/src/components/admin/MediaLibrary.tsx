"use client";

import { Check, Film, Images, Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { assignMedia } from "@/app/admin/actions";
import { btn } from "./ui";

export type PickerFile = { src: string; name: string; type: "image" | "video"; uploaded: boolean };

/** Small preview of a library file (videos show their first frame). */
export function Thumb({ file, className = "" }: { file: { src: string; type: "image" | "video" }; className?: string }) {
  return file.type === "video" ? (
    <video src={`${file.src}#t=0.5`} className={`size-full object-cover ${className}`} muted preload="metadata" />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={file.src} alt="" loading="lazy" className={`size-full object-cover ${className}`} />
  );
}

/**
 * "Choose from library": opens a window with every photo (or video) already on
 * the site; clicking one uses it for this spot right away.
 */
export function LibraryPicker({ slotKey, slotLabel, type, current, files }: { slotKey: string; slotLabel: string; type: "image" | "video"; current: string; files: PickerFile[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [onlyUploads, setOnlyUploads] = useState(false);
  const list = useMemo(
    () => files.filter((f) => f.type === type && (!onlyUploads || f.uploaded) && f.name.toLowerCase().includes(query.trim().toLowerCase())),
    [files, type, onlyUploads, query],
  );

  return (
    <>
      <button type="button" onClick={() => dialog.current?.showModal()} className={`${btn.secondary} flex-1`}>
        {type === "video" ? <Film className="size-4" /> : <Images className="size-4" />} Choose from library
      </button>

      <dialog
        ref={dialog}
        className="m-auto max-h-[90dvh] w-[min(1100px,calc(100%-1.5rem))] overflow-hidden rounded-2xl p-0 shadow-2xl backdrop:bg-navy-950/60"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="flex max-h-[90dvh] flex-col">
          <div className="flex flex-wrap items-center gap-3 border-b border-line px-6 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold tracking-wide text-muted uppercase">Choose {type === "video" ? "a video" : "a photo"} for</p>
              <h2 className="truncate text-lg font-extrabold text-navy-900">{slotLabel}</h2>
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm">
              <Search className="size-4 text-muted" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search file name" className="w-40 outline-none" />
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-navy-900">
              <input type="checkbox" checked={onlyUploads} onChange={(e) => setOnlyUploads(e.target.checked)} className="size-4 accent-navy-700" />
              Only my uploads
            </label>
            <button type="button" onClick={() => dialog.current?.close()} className="flex size-10 items-center justify-center rounded-full hover:bg-paper" aria-label="Close">
              <X className="size-5" />
            </button>
          </div>

          <form action={assignMedia} className="overflow-y-auto p-6">
            <input type="hidden" name="key" value={slotKey} />
            {list.length === 0 ? (
              <p className="py-16 text-center text-muted">No {type === "video" ? "videos" : "photos"} match. Upload one with “Upload new” instead.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {list.map((f) => {
                  const inUse = f.src === current;
                  return (
                    <button
                      key={f.src}
                      type="submit"
                      name="src"
                      value={f.src}
                      disabled={inUse}
                      className={`group overflow-hidden rounded-xl border text-start transition ${
                        inUse ? "cursor-default border-navy-700 ring-2 ring-navy-700" : "border-line hover:border-navy-700 hover:shadow-lg"
                      }`}
                    >
                      <span className="relative block aspect-[4/3] bg-[repeating-conic-gradient(#eef1f5_0_25%,#f8fafc_0_50%)] bg-[length:18px_18px]">
                        <Thumb file={f} />
                        {inUse && (
                          <span className="absolute top-2 end-2 flex items-center gap-1 rounded-full bg-navy-700 px-2 py-1 text-xs font-bold text-white">
                            <Check className="size-3.5" /> In use
                          </span>
                        )}
                      </span>
                      <span className="block truncate px-3 py-2 text-xs font-bold text-navy-900" title={f.name}>
                        {f.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </form>
        </div>
      </dialog>
    </>
  );
}
