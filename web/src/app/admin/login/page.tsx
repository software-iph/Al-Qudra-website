import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getUser()) redirect("/admin");

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative isolate hidden flex-col justify-between overflow-hidden bg-navy-950 p-12 text-white lg:flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/approach-1.webp" alt="" className="absolute inset-0 -z-20 size-full object-cover opacity-25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950 via-navy-900/90 to-navy-700/70" />
        <div className="grid-lines absolute inset-0 -z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-white.png" alt="Alqudra" className="h-11 w-auto self-start" />
        <div>
          <h1 className="max-w-md text-4xl leading-tight font-extrabold">Manage the Alqudra website from one place.</h1>
          <p className="mt-5 max-w-md leading-8 text-white/65">
            Texts in English and Arabic, photos and videos, services, gallery, careers and messages.
          </p>
        </div>
        <p className="text-sm text-white/40">© {new Date().getFullYear()} Al-Qudra for Engineering Consultancy</p>
      </section>

      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-navy.png" alt="Alqudra" className="mb-10 h-10 w-auto lg:hidden" />
          <h2 className="text-3xl font-extrabold text-navy-900">Welcome back</h2>
          <p className="mt-2 text-muted">Sign in to the dashboard.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
