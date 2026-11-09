import { count, desc, eq, isNull } from "drizzle-orm";
import { ArrowRight, AtSign, Briefcase, Image as ImageIcon, FileText, Images, Layers, Mail, Plus, Settings, Type } from "lucide-react";
import Link from "next/link";
import { Badge, Panel } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";

export default async function DashboardPage() {
  const user = await requireUser();
  const value = (rows: { value: number }[]) => rows[0]?.value ?? 0;
  const [unread, applications, subscribers, jobs, photos, services, latest] = await Promise.all([
    db.select({ value: count() }).from(schema.messages).where(isNull(schema.messages.readAt)).then(value),
    db.select({ value: count() }).from(schema.applications).where(isNull(schema.applications.readAt)).then(value),
    db.select({ value: count() }).from(schema.subscribers).then(value),
    db.select({ value: count() }).from(schema.careers).where(eq(schema.careers.active, true)).then(value),
    db.select({ value: count() }).from(schema.gallery).where(eq(schema.gallery.active, true)).then(value),
    db.select({ value: count() }).from(schema.services).where(eq(schema.services.active, true)).then(value),
    db.select().from(schema.messages).orderBy(desc(schema.messages.createdAt)).limit(6),
  ]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const stats = [
    { label: "Unread messages", value: unread, icon: Mail, href: "/admin/messages", tone: "bg-red-50 text-red-600" },
    { label: "Subscribers", value: subscribers, icon: AtSign, href: "/admin/subscribers", tone: "bg-sky-soft text-navy-700" },
    { label: "Open jobs", value: jobs, icon: Briefcase, href: "/admin/careers", tone: "bg-emerald-50 text-emerald-700" },
    { label: "Gallery photos", value: photos, icon: Images, href: "/admin/gallery", tone: "bg-amber-50 text-amber-700" },
    { label: "Services", value: services, icon: Layers, href: "/admin/services", tone: "bg-indigo-50 text-indigo-700" },
    { label: "New job applications", value: applications, icon: FileText, href: "/admin/applications", tone: "bg-slate-100 text-slate-700" },
  ];
  const quick = [
    { href: "/admin/texts", label: "Edit website texts (English / Arabic)", icon: Type },
    { href: "/admin/media", label: "Replace images & videos", icon: ImageIcon },
    { href: "/admin/gallery", label: "Add photos to the gallery", icon: Images },
    { href: "/admin/careers/new", label: "Post a job opening", icon: Plus },
    { href: "/admin/settings", label: "Phone, emails & social links", icon: Settings },
  ];

  return (
    <>
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 to-navy-600 p-8 text-white sm:p-10">
        <div className="grid-lines absolute inset-0" />
        <div className="absolute -top-20 -right-20 size-72 rounded-full border-[40px] border-white/5" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              {greeting}, {user.name}
            </h1>
            <p className="mt-2 max-w-xl text-white/70">Everything on the Alqudra website is managed from here. Changes appear on the site immediately.</p>
          </div>
          <a href="/ar" target="_blank" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-navy-800 transition hover:bg-sky-soft">
            Open website <ArrowRight className="size-4" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <span className={`flex size-11 items-center justify-center rounded-xl ${s.tone}`}>
              <s.icon className="size-5" />
            </span>
            <p className="mt-4 text-3xl font-extrabold text-navy-900">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <Panel
          title="Latest messages"
          className="lg:col-span-3"
          padded={false}
          actions={
            <Link href="/admin/messages" className="text-sm font-bold text-navy-600 hover:underline">
              View all
            </Link>
          }
        >
          {latest.length === 0 ? (
            <p className="px-6 py-12 text-center text-muted">No messages yet. Messages from the Contact page appear here.</p>
          ) : (
            <ul className="divide-y divide-line">
              {latest.map((m) => (
                <li key={m.id}>
                  <Link href={`/admin/messages/${m.id}`} className="flex items-center gap-4 px-6 py-4 transition hover:bg-paper">
                    <span className={`size-2 shrink-0 rounded-full ${m.readAt ? "bg-transparent" : "bg-red-500"}`} />
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate ${m.readAt ? "text-navy-900" : "font-extrabold text-navy-900"}`}>{m.name}</span>
                      <span className="block truncate text-sm text-muted">{m.subject || m.message}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted">{m.createdAt.toLocaleDateString("en-GB")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Quick actions" className="lg:col-span-2" padded={false}>
          <ul className="p-2">
            {quick.map((q) => (
              <li key={q.href}>
                <Link href={q.href} className="flex items-center gap-3 rounded-xl px-4 py-3 font-bold text-navy-900 transition hover:bg-paper">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-sky-soft text-navy-700">
                    <q.icon className="size-4" />
                  </span>
                  <span className="flex-1 text-[15px]">{q.label}</span>
                  <ArrowRight className="size-4 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-6 py-4 text-sm text-muted">
            Signed in as <Badge tone="blue">{user.email}</Badge>
          </div>
        </Panel>
      </div>
    </>
  );
}
