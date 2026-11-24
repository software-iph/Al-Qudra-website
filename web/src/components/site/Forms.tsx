"use client";

import { ArrowRight, CircleCheck, Send } from "lucide-react";
import { useActionState } from "react";
import { submitContact, subscribe, type FormState } from "@/app/[lang]/actions";

type Labels = Record<string, string>;

const Honeypot = () => (
  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />
);

function message(state: FormState, l: Labels) {
  if (!state || state.ok) return null;
  return state.error === "invalid" ? l.invalid : l.error;
}

export function ContactForm({ labels: l }: { labels: Labels }) {
  const [state, action, pending] = useActionState(submitContact, null);
  const bad = (field: string) => (state?.fields?.includes(field) ? "border-red-400 focus:border-red-400 focus:ring-red-400/10" : "");

  if (state?.ok) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-4 border border-line bg-limestone/60 p-10 text-center">
        <CircleCheck className="size-14 text-navy-700" strokeWidth={1.25} />
        <p className="max-w-sm text-lg font-semibold text-ink">{l.success}</p>
      </div>
    );
  }

  return (
    <form action={action} className="relative grid gap-4 sm:grid-cols-2" noValidate>
      <Honeypot />
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-ink">{l.name}</span>
        <input name="name" required maxLength={150} autoComplete="name" className={`field ${bad("name")}`} />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-ink">{l.email}</span>
        <input name="email" type="email" required maxLength={200} autoComplete="email" dir="ltr" className={`field ${bad("email")}`} />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-ink">{l.phone}</span>
        <input name="phone" type="tel" maxLength={50} autoComplete="tel" dir="ltr" className="field" />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-ink">{l.subject}</span>
        <input name="subject" maxLength={200} className="field" />
      </label>
      <label className="grid gap-2 sm:col-span-2">
        <span className="text-sm font-semibold text-ink">{l.message}</span>
        <textarea name="message" required rows={5} maxLength={5000} className={`field resize-y ${bad("message")}`} />
      </label>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={pending} className="btn-accent px-8 py-4 disabled:opacity-60">
          {pending ? l.sending : l.send}
          <Send className="flip-rtl size-4" aria-hidden />
        </button>
        {message(state, l) && (
          <p className="text-sm font-bold text-red-600" role="alert">
            {message(state, l)}
          </p>
        )}
      </div>
    </form>
  );
}

export function SubscribeForm({ labels: l }: { labels: Labels }) {
  const [state, action, pending] = useActionState(subscribe, null);
  if (state?.ok) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-sky">
        <CircleCheck className="size-5" /> {l.success}
      </p>
    );
  }
  return (
    <form action={action} className="relative">
      <Honeypot />
      <div className="flex rounded-[2px] border border-paper/25 p-1 transition-colors duration-[120ms] focus-within:border-sky">
        <input
          name="email"
          type="email"
          required
          dir="ltr"
          placeholder={l.placeholder}
          className="min-h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-paper outline-none placeholder:!text-paper/60"
        />
        <button type="submit" disabled={pending} aria-label={l.button} className="btn bg-paper px-4 text-ink hover:bg-sky disabled:opacity-60">
          <ArrowRight className="flip-rtl size-4" />
        </button>
      </div>
      {message(state, l) && <p className="mt-2 text-xs font-bold text-red-300">{message(state, l)}</p>}
    </form>
  );
}
