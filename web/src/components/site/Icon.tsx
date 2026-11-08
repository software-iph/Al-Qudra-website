import {
  Award,
  BadgeCheck,
  Building2,
  CalendarCheck,
  ClipboardList,
  FileCheck,
  FolderKanban,
  Gauge,
  GraduationCap,
  Handshake,
  HardHat,
  HeartHandshake,
  Landmark,
  Layers,
  Leaf,
  Route,
  Ruler,
  Scale,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Icons that can be chosen in the dashboard for services and list items. */
export const ICONS: Record<string, LucideIcon> = {
  "hard-hat": HardHat,
  "building-2": Building2,
  handshake: Handshake,
  "badge-check": BadgeCheck,
  "graduation-cap": GraduationCap,
  ruler: Ruler,
  scale: Scale,
  "calendar-check": CalendarCheck,
  "shield-check": ShieldCheck,
  users: Users,
  award: Award,
  target: Target,
  gauge: Gauge,
  "trending-up": TrendingUp,
  layers: Layers,
  "file-check": FileCheck,
  route: Route,
  "clipboard-list": ClipboardList,
  landmark: Landmark,
  leaf: Leaf,
  "heart-handshake": HeartHandshake,
  "folder-kanban": FolderKanban,
};

export const ICON_NAMES = Object.keys(ICONS);

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? BadgeCheck;
  return <Cmp className={className} strokeWidth={1.6} aria-hidden />;
}
