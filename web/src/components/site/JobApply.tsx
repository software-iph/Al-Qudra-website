"use client";

import { ArrowUpRight, CircleCheck, FileText, Send, Upload, X } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import { submitApplication } from "@/app/[lang]/actions";

type Labels = Record<string, string>;

/** "Apply now" button that opens the application form in a dialog (jobId 0 = open application). */
export function JobApply({
  jobId,
  jobTitle,
  heading,
  button,
  variant = "primary",
  labels,
}: {
  jobId: number;
  jobTitle: string;
  heading: string;
  button: string;
  variant?: "primary" | "outline";
  labels: Labels;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [round, setRound] = useState(0); // new empty form after a successful application

  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className={`${variant === "primary" ? "btn-primary" : "btn-outline"} shrink-0`}
      >
        {button}
        <ArrowUpRight className="flip-rtl size-4" aria-hidden />
      </button>

      <dialog
        ref={dialog}
        aria-labelledby={`apply-${jobId}`}
        className="aq-dialog m-auto max-h-[92dvh] w-[min(680px,calc(100%-1.5rem))] overflow-y-auto rounded-3xl bg-white p-0 text-ink shadow-2xl backdrop:bg-navy-950/60 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) close(); // click on the dimmed background
        }}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white/95 px-6 py-5 backdrop-blur sm:px-8">
          <div>
            <p className="text-sm font-bold text-navy-600">{heading}</p>
            <h2 id={`apply-${jobId}`} className="mt-1 text-xl font-extrabold text-navy-900 sm:text-2xl">
              {jobTitle}
            </h2>
          </div>
          <button type="button" onClick={close} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-paper text-navy-900 transition hover:bg-sky-soft" aria-label={labels.close}>
            <X className="size-5" />
          </button>
        </div>
        <ApplicationForm
          key={round}
          jobId={jobId}
          labels={labels}
          onFinish={() => {
            close();
            setRound((r) => r + 1);
          }}
        />
      </dialog>
    </>
  );
}

function ApplicationForm({ jobId, labels: l, onFinish }: { jobId: number; labels: Labels; onFinish: () => void }) {
  const [state, action, pending] = useActionState(submitApplication, null);
  const [fileName, setFileName] = useState("");
  const bad = (field: string) => (state?.fields?.includes(field) ? "border-red-400 focus:border-red-400 focus:ring-red-400/10" : "");

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center gap-5 px-8 py-14 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-sky-soft">
          <CircleCheck className="size-10 text-navy-600" strokeWidth={1.5} />
        </div>
        <p className="max-w-md text-lg leading-8 font-bold text-navy-900">{l.success}</p>
        <button type="button" onClick={onFinish} className="btn-primary">
          {l.close}
        </button>
      </div>
    );
  }

  const error = !state || state.ok ? null : state.error === "cv" ? l.cv_invalid : state.error === "invalid" ? l.invalid : l.error;

  return (
    <form action={action} className="relative grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />
      <input type="hidden" name="careerId" value={jobId} />

      <label className="grid gap-2">
        <span className="text-sm font-bold text-navy-900">{l.name} *</span>
        <input name="name" required maxLength={150} autoComplete="name" className={`field ${bad("name")}`} />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-bold text-navy-900">{l.email} *</span>
        <input name="email" type="email" required maxLength={200} autoComplete="email" dir="ltr" className={`field ${bad("email")}`} />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-bold text-navy-900">{l.phone} *</span>
        <input name="phone" type="tel" required maxLength={50} autoComplete="tel" dir="ltr" className={`field ${bad("phone")}`} />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-bold text-navy-900">{l.city}</span>
        <input name="city" maxLength={100} autoComplete="address-level2" className="field" />
      </label>
      <label className="grid gap-2 sm:col-span-2">
        <span className="text-sm font-bold text-navy-900">{l.link}</span>
        <input name="link" type="url" maxLength={300} dir="ltr" placeholder="https://" className={`field ${bad("link")}`} />
      </label>

      <div className="grid gap-2 sm:col-span-2">
        <span className="text-sm font-bold text-navy-900">{l.cv} *</span>
        <label
          className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed px-5 py-4 transition hover:border-navy-600 hover:bg-sky-soft/40 ${
            state?.fields?.includes("cv") ? "border-red-400" : fileName ? "border-navy-600 bg-sky-soft/40" : "border-line"
          }`}
        >
          <span className="icon-tile size-11 shrink-0">{fileName ? <FileText className="size-5" /> : <Upload className="size-5" />}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-bold text-navy-900" dir="auto">
              {fileName || l.cv_pick}
            </span>
            <span className="block text-xs text-muted">PDF · DOC · DOCX</span>
          </span>
          <input
            name="cv"
            type="file"
            required
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
        </label>
      </div>

      <label className="grid gap-2 sm:col-span-2">
        <span className="text-sm font-bold text-navy-900">{l.message}</span>
        <textarea name="message" rows={4} maxLength={3000} className="field resize-y" />
      </label>

      <div className="flex flex-wrap items-center gap-4 pt-1 sm:col-span-2">
        <button type="submit" disabled={pending} className="btn-primary px-8 py-4 disabled:opacity-60">
          {pending ? l.sending : l.submit}
          <Send className="flip-rtl size-4" aria-hidden />
        </button>
        {error && (
          <p className="text-sm font-bold text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
