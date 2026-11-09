"use client";

import { CircleAlert, CircleCheck, Upload, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { btn } from "./ui";

const noop = () => () => undefined;

/** Submit button that shows a pending state while the Server Action runs. */
export function SubmitButton({ children, className = btn.primary, pendingText = "Saving..." }: { children: ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingText : children}
    </button>
  );
}

/** Button that asks for confirmation before submitting its form. */
export function ConfirmButton({ children, message, className = btn.danger, formAction }: { children: ReactNode; message: string; className?: string; formAction?: (fd: FormData) => void }) {
  return (
    <button
      type="submit"
      formAction={formAction}
      formNoValidate
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

/** Shows ?ok=... / ?error=... messages from Server Action redirects, then clears them. */
export function Toast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const ok = params.get("ok");
  const error = params.get("error");
  const text = error ?? ok;
  const [dismissed, setDismissed] = useState<string | null>(null);

  useEffect(() => {
    if (!text) return;
    const timer = setTimeout(() => {
      const next = new URLSearchParams(params);
      next.delete("ok");
      next.delete("error");
      router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
    }, 3500);
    return () => clearTimeout(timer);
  }, [text, params, pathname, router]);

  // Browser-only: the server and the first client render can see different URLs after a redirect.
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  if (!mounted || !text || dismissed === text) return null;
  return (
    <div className="fixed right-6 bottom-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl bg-navy-900 px-5 py-4 text-sm font-bold text-white shadow-2xl" role="status">
      {error ? <CircleAlert className="size-5 shrink-0 text-red-300" /> : <CircleCheck className="size-5 shrink-0 text-emerald-300" />}
      <span>{text}</span>
      <button type="button" onClick={() => setDismissed(text)} className="ms-2 text-white/60 hover:text-white" aria-label="Dismiss">
        <X className="size-4" />
      </button>
    </div>
  );
}

/** File input with an instant preview of the chosen image/video. */
export function FileInput({ name, accept, current, kind = "image", required, multiple }: { name: string; accept: string; current?: string; kind?: "image" | "video"; required?: boolean; multiple?: boolean }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [label, setLabel] = useState<string>("");
  const src = preview ?? current;

  return (
    <div className="grid gap-3">
      {src && !multiple && (
        <div className="overflow-hidden rounded-xl bg-[repeating-conic-gradient(#eef1f5_0_25%,#f8fafc_0_50%)] bg-[length:18px_18px] p-2">
          {kind === "video" ? (
            <video src={src} className="mx-auto max-h-48 rounded-lg" muted controls preload="metadata" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" className="mx-auto max-h-48 rounded-lg object-contain" />
          )}
        </div>
      )}
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-navy-700/25 bg-paper px-4 py-3 text-sm font-bold text-navy-700 transition hover:border-navy-700 hover:bg-sky-soft/50">
        <Upload className="size-4 shrink-0" />
        <span className="truncate">{label || (multiple ? "Choose photos..." : current ? "Choose a new file..." : "Choose a file...")}</span>
        <input
          type="file"
          name={name}
          accept={accept}
          required={required}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => {
            const files = e.target.files;
            if (!files?.length) return;
            setLabel(files.length > 1 ? `${files.length} files selected` : files[0].name);
            if (!multiple) setPreview(URL.createObjectURL(files[0]));
          }}
        />
      </label>
    </div>
  );
}
