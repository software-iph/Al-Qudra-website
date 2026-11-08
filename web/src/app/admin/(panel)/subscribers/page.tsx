import { desc } from "drizzle-orm";
import { Download, Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/admin/client";
import { btn, Empty, PageHeader } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { deleteSubscriber } from "../../actions";

export const metadata = { title: "Subscribers" };

export default async function SubscribersPage() {
  await requireUser();
  const rows = await db.select().from(schema.subscribers).orderBy(desc(schema.subscribers.createdAt));

  return (
    <>
      <PageHeader
        title="Subscribers"
        text={`Emails entered in the newsletter box in the website footer (${rows.length}).`}
        actions={
          rows.length > 0 && (
            <a href="/admin/subscribers/export" download className={btn.secondary}>
              <Download className="size-4" /> Export CSV
            </a>
          )
        }
      />
      {rows.length === 0 ? (
        <Empty>No subscribers yet.</Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <ul className="divide-y divide-line">
            {rows.map((s) => (
              <li key={s.id} className="flex items-center gap-4 px-5 py-3">
                <span className="flex-1 font-bold text-navy-900">{s.email}</span>
                <span className="text-sm text-muted">{s.createdAt.toLocaleDateString("en-GB")}</span>
                <form action={deleteSubscriber}>
                  <input type="hidden" name="id" value={s.id} />
                  <ConfirmButton message={`Remove ${s.email}?`}>
                    <Trash2 className="size-4" />
                  </ConfirmButton>
                </form>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
