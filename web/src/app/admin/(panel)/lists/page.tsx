import { asc, eq } from "drizzle-orm";
import { Plus, Save, Trash2 } from "lucide-react";
import { ConfirmButton, SubmitButton } from "@/components/admin/client";
import { IconPicker } from "@/components/admin/IconPicker";
import { Field, inputCls, PageHeader, Tabs } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { deleteListItem, saveListItem } from "../../actions";

export const metadata = { title: "Values, Q³ & numbers" };

const LISTS: Record<string, { label: string; help: string }> = {
  stats: { label: "Headline numbers", help: "The counters on the Home and About pages. Title = label, value = the number (e.g. 1000)." },
  q3: { label: "Q³ pillars", help: "The three pillars of the Q³ methodology (Home and About pages)." },
  values: { label: "Core values", help: "Shown on the About and Careers pages; the first four also appear on the Home page." },
  goals: { label: "Strategic goals", help: "Shown on the About page." },
  strengths: { label: "What sets us apart", help: "The cards in the \"Why Al-Qudra\" section on the Home page." },
};

type Item = typeof schema.listItems.$inferSelect;

function ItemForm({ item, list }: { item?: Item; list: string }) {
  const stats = list === "stats";
  return (
    <form action={saveListItem} className="grid gap-4">
      <input type="hidden" name="id" value={item?.id ?? 0} />
      <input type="hidden" name="list" value={list} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title (English) *">
          <input name="titleEn" required defaultValue={item?.titleEn} className={inputCls} />
        </Field>
        <Field label="العنوان (Arabic)">
          <input name="titleAr" defaultValue={item?.titleAr} dir="rtl" className={inputCls} />
        </Field>
        {stats ? (
          <Field label="Number">
            <input name="bodyEn" type="number" min={0} defaultValue={item?.bodyEn} className={inputCls} />
          </Field>
        ) : (
          <>
            <Field label="Description (English)">
              <textarea name="bodyEn" rows={3} defaultValue={item?.bodyEn} className={inputCls} />
            </Field>
            <Field label="الوصف (Arabic)">
              <textarea name="bodyAr" rows={3} defaultValue={item?.bodyAr} dir="rtl" className={inputCls} />
            </Field>
          </>
        )}
      </div>
      <Field label="Icon">
        <IconPicker name="icon" value={item?.icon ?? "badge-check"} />
      </Field>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
        <div className="flex items-center gap-5">
          <label className="flex items-center gap-2 text-sm font-bold text-navy-900">
            Order <input type="number" name="sort" min={0} defaultValue={item?.sort ?? 99} className={`${inputCls} w-20 py-1.5`} />
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-navy-900">
            <input type="checkbox" name="active" defaultChecked={item?.active ?? true} className="size-4 accent-navy-700" /> Shown
          </label>
        </div>
        <div className="flex gap-2">
          {item && (
            <ConfirmButton formAction={deleteListItem} message="Delete this item?">
              <Trash2 className="size-4" /> Delete
            </ConfirmButton>
          )}
          <SubmitButton>
            {item ? <Save className="size-4" /> : <Plus className="size-4" />} {item ? "Save" : "Add item"}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}

export default async function ListsPage({ searchParams }: PageProps<"/admin/lists">) {
  await requireUser();
  const { list: requested } = await searchParams;
  const list = typeof requested === "string" && requested in LISTS ? requested : "stats";
  const all = await db.select({ list: schema.listItems.list }).from(schema.listItems);
  const items = await db.select().from(schema.listItems).where(eq(schema.listItems.list, list)).orderBy(asc(schema.listItems.sort), asc(schema.listItems.id));

  return (
    <>
      <PageHeader title="Values, Q³ & numbers" text="Repeating cards used across the website. Pick a list, edit an item and press Save." />
      <Tabs
        active={list}
        items={Object.entries(LISTS).map(([key, l]) => ({ key, label: l.label, href: `/admin/lists?list=${key}`, count: all.filter((r) => r.list === key).length }))}
      />
      <p className="mb-6 text-sm text-muted">{LISTS[list].help}</p>
      <div className="grid gap-4">
        {items.map((item) => (
          <details key={item.id} className="group rounded-2xl border border-line bg-white shadow-sm open:shadow-md">
            <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4">
              <span className="flex size-9 items-center justify-center rounded-lg bg-paper text-sm font-extrabold text-navy-700">{item.sort}</span>
              <span className="flex-1">
                <span className="font-extrabold text-navy-900">{item.titleEn}</span>
                <span className="ms-3 inline-block text-sm text-muted" dir="rtl">
                  {item.titleAr}
                </span>
              </span>
              {list === "stats" && <span className="font-extrabold text-navy-700">{item.bodyEn}+</span>}
              {!item.active && <span className="text-xs font-bold text-muted">hidden</span>}
              <span className="text-sm font-bold text-navy-600 group-open:hidden">Edit</span>
            </summary>
            <div className="border-t border-line p-5">
              <ItemForm item={item} list={list} />
            </div>
          </details>
        ))}
        <details className="rounded-2xl border border-dashed border-navy-700/25 bg-white">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 font-bold text-navy-700">
            <Plus className="size-4" /> Add an item to “{LISTS[list].label}”
          </summary>
          <div className="border-t border-line p-5">
            <ItemForm list={list} />
          </div>
        </details>
      </div>
    </>
  );
}
