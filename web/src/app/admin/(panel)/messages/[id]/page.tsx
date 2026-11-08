import { and, eq, isNull } from "drizzle-orm";
import { ArrowLeft, Mail, Phone, Reply, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/client";
import { btn, PageHeader, Panel } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { deleteMessage } from "../../../actions";

export default async function MessagePage({ params }: PageProps<"/admin/messages/[id]">) {
  await requireUser();
  const id = Number((await params).id);
  const [m] = await db.select().from(schema.messages).where(eq(schema.messages.id, id));
  if (!m) notFound();
  if (!m.readAt) {
    await db.update(schema.messages).set({ readAt: new Date() }).where(and(eq(schema.messages.id, id), isNull(schema.messages.readAt)));
  }

  return (
    <>
      <PageHeader
        title={m.subject || "Message"}
        actions={
          <Link href="/admin/messages" className={btn.secondary}>
            <ArrowLeft className="size-4" /> All messages
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <p className="text-[16px] leading-8 whitespace-pre-wrap text-ink" dir="auto">
            {m.message}
          </p>
        </Panel>
        <Panel title="From">
          <div className="grid gap-4 text-sm">
            <p className="text-lg font-extrabold text-navy-900">{m.name}</p>
            <a href={`mailto:${m.email}`} className="flex items-center gap-2 text-navy-700 hover:underline">
              <Mail className="size-4" /> {m.email}
            </a>
            {m.phone && (
              <a href={`tel:${m.phone}`} className="flex items-center gap-2 text-navy-700 hover:underline">
                <Phone className="size-4" /> <span dir="ltr">{m.phone}</span>
              </a>
            )}
            <p className="text-muted">{m.createdAt.toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}</p>
            <div className="flex gap-2 border-t border-line pt-4">
              <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "Your message to Al-Qudra"}`)}`} className={`${btn.primary} flex-1`}>
                <Reply className="size-4" /> Reply
              </a>
              <form action={deleteMessage}>
                <input type="hidden" name="id" value={m.id} />
                <ConfirmButton message="Delete this message?">
                  <Trash2 className="size-4" />
                </ConfirmButton>
              </form>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
