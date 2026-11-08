import { asc } from "drizzle-orm";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { ConfirmButton } from "@/components/admin/client";
import { Badge, btn, Empty, PageHeader } from "@/components/admin/ui";
import { Icon } from "@/components/site/Icon";
import { requireUser } from "@/lib/auth";
import { lines } from "@/lib/content";
import { db, schema } from "@/lib/db";
import { deleteService } from "../../actions";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  await requireUser();
  const rows = await db.select().from(schema.services).orderBy(asc(schema.services.sort), asc(schema.services.id));

  return (
    <>
      <PageHeader
        title="Services"
        text="The service cards on the Home and Services pages."
        actions={
          <Link href="/admin/services/new" className={btn.primary}>
            <Plus className="size-4" /> Add service
          </Link>
        }
      />
      {rows.length === 0 ? (
        <Empty>No services yet.</Empty>
      ) : (
        <div className="grid gap-4">
          {rows.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-5 rounded-2xl border border-line bg-white p-4 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt="" className="h-20 w-32 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Icon name={s.icon} className="size-4 text-navy-600" />
                  <h3 className="font-extrabold text-navy-900">{s.titleEn}</h3>
                </div>
                <p className="mt-1 text-sm text-muted" dir="rtl">
                  {s.titleAr}
                </p>
                <p className="mt-2 text-xs text-muted">
                  {lines(s.pointsEn).length} points · order {s.sort}
                </p>
              </div>
              <Badge tone={s.active ? "green" : "slate"}>{s.active ? "Shown" : "Hidden"}</Badge>
              <div className="flex gap-2">
                <Link href={`/admin/services/${s.id}`} className={btn.secondary}>
                  <Pencil className="size-4" /> Edit
                </Link>
                <form action={deleteService}>
                  <input type="hidden" name="id" value={s.id} />
                  <ConfirmButton message={`Delete "${s.titleEn}"?`}>
                    <Trash2 className="size-4" />
                  </ConfirmButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
