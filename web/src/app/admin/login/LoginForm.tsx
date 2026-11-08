"use client";

import { ArrowRight, Eye, EyeOff, Lock } from "lucide-react";
import { useActionState, useState } from "react";
import { inputCls } from "@/components/admin/ui";
import { login } from "../actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="mt-8 grid gap-5">
      <label className="grid gap-1.5">
        <span className="text-sm font-bold text-navy-900">Email</span>
        <input name="email" type="email" required autoFocus autoComplete="username" className={`${inputCls} py-3`} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-bold text-navy-900">Password</span>
        <span className="relative">
          <input name="password" type={show ? "text" : "password"} required autoComplete="current-password" className={`${inputCls} py-3 pe-11`} />
          <button type="button" onClick={() => setShow((v) => !v)} className="absolute inset-y-0 end-0 flex w-11 items-center justify-center text-muted hover:text-navy-700" aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </span>
      </label>
      {error && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700" role="alert">
          <Lock className="size-4" /> {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-navy-700 px-4 py-3.5 font-bold text-white shadow-lg shadow-navy-700/20 transition hover:bg-navy-600 disabled:opacity-60">
        {pending ? "Signing in..." : "Sign in"} <ArrowRight className="size-4" />
      </button>
    </form>
  );
}
