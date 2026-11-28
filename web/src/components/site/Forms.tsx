"use client";

import { ArrowRight, CircleCheck, Send } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { submitContact, subscribe, type FormState } from "@/app/[lang]/actions";

type Labels = Record<string, string>;

export const Honeypot = () => (
  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />
);

export function formError(state: FormState, l: Labels) {
  if (!state || state.ok) return null;
  if (state.error === "busy") return l.busy || l.error;
  if (state.error === "consent") return l.consentMissing || l.invalid;
  if (state.error === "cv") return l.cv_invalid || l.invalid;
  return state.error === "invalid" ? l.invalid : l.error;
}

/** Label + control + inline error, wired with aria-describedby. */
export function FieldRow({
  id,
  label,
  required,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string | false;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`grid content-start gap-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="ms-1 text-amber-700" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-[#b3412f]">
          {error}
        </p>
      )}
    </div>
  );
}

/** "I agree…" checkbox with a link to the privacy policy (IPH C5). */
export function Consent({ name = "consent", text, linkLabel, href, invalid, dark = false }: { name?: string; text: string; linkLabel: string; href: string; invalid?: boolean; dark?: boolean }) {
  return (
    <label className={`flex items-start gap-3 text-sm leading-6 ${dark ? "text-steel-200" : "text-muted"}`}>
      <input
        type="checkbox"
        aria-label={text}
        name={name}
        value="yes"
        required
        aria-invalid={invalid || undefined}
        className={`mt-1 size-[18px] shrink-0 accent-patina-700 ${invalid ? "outline-2 outline-[#b3412f]" : ""}`}
      />
      <span>
        {text}{" "}
        <Link href={href} target="_blank" className={`underline underline-offset-4 ${dark ? "text-patina-400" : "text-patina-700"}`}>
          {linkLabel}
        </Link>
      </span>
    </label>
  );
}

export function ContactForm({ labels: l, privacyHref }: { labels: Labels; privacyHref: string }) {
  const [state, action, pending] = useActionState(submitContact, null);
  const bad = (field: string) => !!state?.fields?.includes(field);
  const alertRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (state && !state.ok) alertRef.current?.focus();
  }, [state]);

  if (state?.ok) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-[4px] bg-patina-100 p-10 text-center" role="status">
        <CircleCheck className="size-12 text-patina-700" strokeWidth={1.5} aria-hidden />
        <p className="max-w-sm text-lg font-medium text-ink">{l.success}</p>
      </div>
    );
  }

  const input = (name: string, extra: Record<string, unknown> = {}) => ({
    id: `c-${name}`,
    name,
    "aria-invalid": bad(name) || undefined,
    "aria-describedby": bad(name) ? `c-${name}-error` : undefined,
    className: `field ${bad(name) ? "border-[#b3412f]" : ""}`,
    ...extra,
  });

  return (
    <form action={action} className="relative grid gap-5 sm:grid-cols-2" noValidate>
      <Honeypot />
      <FieldRow id="c-name" label={l.name} required error={bad("name") && l.invalid}>
        <input {...input("name", { required: true, maxLength: 150, autoComplete: "name" })} />
      </FieldRow>
      <FieldRow id="c-email" label={l.email} required error={bad("email") && l.invalid}>
        <input {...input("email", { type: "email", required: true, maxLength: 200, autoComplete: "email", dir: "ltr" })} />
      </FieldRow>
      <FieldRow id="c-phone" label={l.phone}>
        <input {...input("phone", { type: "tel", maxLength: 50, autoComplete: "tel", dir: "ltr" })} />
      </FieldRow>
      <FieldRow id="c-subject" label={l.subject}>
        <input {...input("subject", { maxLength: 200 })} />
      </FieldRow>
      <FieldRow id="c-message" label={l.message} required error={bad("message") && l.invalid} className="sm:col-span-2">
        <textarea {...input("message", { required: true, rows: 6, maxLength: 5000 })} className={`field resize-y ${bad("message") ? "border-[#b3412f]" : ""}`} />
      </FieldRow>
      <div className="sm:col-span-2">
        <Consent text={l.consent} linkLabel={l.consentLink} href={privacyHref} invalid={bad("consent")} />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60" aria-busy={pending}>
          {pending ? l.sending : l.send}
          <Send className="flip-rtl size-4" aria-hidden />
        </button>
        {formError(state, l) && (
          <p ref={alertRef} tabIndex={-1} className="text-sm font-medium text-[#b3412f] outline-none" role="alert">
            {formError(state, l)}
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
      <p className="flex items-center gap-2 text-sm font-medium text-patina-400" role="status">
        <CircleCheck className="size-5" aria-hidden /> {l.success}
      </p>
    );
  }
  return (
    <form action={action} className="relative">
      <Honeypot />
      <label htmlFor="subscribe-email" className="sr-only">
        {l.placeholder}
      </label>
      <div className="flex rounded-[2px] border border-paper/25 p-1 transition-colors duration-[160ms] focus-within:border-patina-400">
        <input
          id="subscribe-email"
          name="email"
          type="email"
          required
          dir="ltr"
          autoComplete="email"
          placeholder={l.placeholder}
          className="min-h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-paper outline-none placeholder:!text-steel-300"
        />
        <button type="submit" disabled={pending} aria-label={l.button} className="btn min-h-11 bg-patina-400 px-4 text-basalt-900 hover:bg-patina-200 disabled:opacity-60">
          <ArrowRight className="flip-rtl size-4" aria-hidden />
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-steel-300">
        {l.consent}{" "}
        <Link href={l.privacyHref} className="text-patina-400 underline underline-offset-4">
          {l.consentLink}
        </Link>
      </p>
      {formError(state, l) && (
        <p className="mt-2 text-xs font-medium text-[#f2a596]" role="alert">
          {formError(state, l)}
        </p>
      )}
    </form>
  );
}
