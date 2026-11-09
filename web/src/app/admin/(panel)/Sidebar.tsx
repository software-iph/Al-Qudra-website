"use client";

import {
  AtSign,
  Briefcase,
  FileText,
  Image as ImageIcon,
  Images,
  Inbox,
  LayoutDashboard,
  Layers,
  List,
  Menu,
  Settings,
  Type,
  UserCog,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { section: "Website content" },
  { href: "/admin/texts", label: "Texts (EN / AR)", icon: Type },
  { href: "/admin/media", label: "Images & videos", icon: ImageIcon },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/lists", label: "Values, Q³ & numbers", icon: List },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/careers", label: "Job openings", icon: Briefcase },
  { section: "Inbox" },
  { href: "/admin/messages", label: "Messages", icon: Inbox, badge: "messages" },
  { href: "/admin/applications", label: "Job applications", icon: FileText, badge: "applications" },
  { href: "/admin/subscribers", label: "Subscribers", icon: AtSign },
  { section: "System" },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Users & password", icon: UserCog },
] as const;

export function Sidebar({ unread }: { unread: { messages: number; applications: number } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed top-3 left-4 z-40 flex size-10 items-center justify-center rounded-full bg-white text-navy-900 shadow ring-1 ring-line lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>
      {open && <div className="fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-white.png" alt="Alqudra" className="h-8 w-auto" />
          </Link>
          <button type="button" onClick={() => setOpen(false)} className="text-white/60 lg:hidden" aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((item, i) =>
            "section" in item ? (
              <p key={i} className="px-3 pt-6 pb-2 text-[11px] font-bold tracking-[0.14em] text-white/40 uppercase">
                {item.section}
              </p>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition ${
                  active(item.href) ? "bg-white font-bold text-navy-800 shadow-lg shadow-black/20" : "text-white/75 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                <item.icon className="size-[18px]" strokeWidth={1.8} />
                <span className="flex-1">{item.label}</span>
                {"badge" in item && unread[item.badge] > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unread[item.badge]}</span>
                )}
              </Link>
            ),
          )}
        </nav>
        <p className="border-t border-white/10 px-6 py-4 text-xs text-white/40">Alqudra · Dashboard</p>
      </aside>
    </>
  );
}
