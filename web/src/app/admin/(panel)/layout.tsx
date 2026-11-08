import { count, isNull } from "drizzle-orm";
import { ExternalLink, LogOut } from "lucide-react";
import { Suspense } from "react";
import { Toast } from "@/components/admin/client";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { logout } from "../actions";
import { Sidebar } from "./Sidebar";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireUser();
  const [{ value: unread }] = await db.select({ value: count() }).from(schema.messages).where(isNull(schema.messages.readAt));

  return (
    <div className="min-h-screen lg:ps-72">
      <Sidebar unread={unread} />
      <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-3 border-b border-line bg-white/85 px-5 backdrop-blur-xl sm:px-8">
        <a href="/ar" target="_blank" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-navy-700 ring-1 ring-line transition hover:bg-paper">
          <ExternalLink className="size-4" /> View website
        </a>
        <div className="flex items-center gap-3 border-s border-line ps-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-navy-700 text-sm font-extrabold text-white">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <span className="hidden text-sm font-bold text-navy-900 sm:block">{user.name}</span>
          <form action={logout}>
            <button type="submit" className="flex size-9 items-center justify-center rounded-full text-muted transition hover:bg-paper hover:text-red-600" aria-label="Sign out" title="Sign out">
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">{children}</main>
      <Suspense>
        <Toast />
      </Suspense>
    </div>
  );
}
