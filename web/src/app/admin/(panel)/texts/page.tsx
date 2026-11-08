import { asc } from "drizzle-orm";
import { Save } from "lucide-react";
import { SubmitButton } from "@/components/admin/client";
import { inputCls, PageHeader, Panel } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { TEXT_GROUPS } from "@/lib/seed-data";
import { saveTexts } from "../../actions";

export const metadata = { title: "Texts" };

export default async function TextsPage({ searchParams }: PageProps<"/admin/texts">) {
  await requireUser();
  const { group: requested } = await searchParams;
  const rows = await db.select().from(schema.texts).orderBy(asc(schema.texts.sort));
  const groups = Object.entries(TEXT_GROUPS).filter(([key]) => rows.some((r) => r.group === key));
  const group = groups.some(([key]) => key === requested) ? String(requested) : groups[0]?.[0];
  const items = rows.filter((r) => r.group === group);

  return (
    <>
      <PageHeader title="Website texts" text="Every heading, paragraph and button on the website, in English and Arabic. If an Arabic field is empty, the English text is shown." />
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav className="h-fit rounded-2xl border border-line bg-white p-2 shadow-sm lg:sticky lg:top-24">
          {groups.map(([key, label]) => (
            <a
              key={key}
              href={`/admin/texts?group=${key}`}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
                key === group ? "bg-navy-700 text-white" : "text-navy-900 hover:bg-paper"
              }`}
            >
              {label}
              <span className={`rounded-full px-2 text-xs ${key === group ? "bg-white/20" : "bg-paper text-muted"}`}>
                {rows.filter((r) => r.group === key).length}
              </span>
            </a>
          ))}
        </nav>

        <form action={saveTexts}>
          <input type="hidden" name="group" value={group} />
          <Panel
            title={TEXT_GROUPS[group]}
            actions={
              <SubmitButton>
                <Save className="size-4" /> Save
              </SubmitButton>
            }
          >
            <div className="grid divide-y divide-dashed divide-line">
              {items.map((t) => (
                <div key={t.key} className="py-5 first:pt-0 last:pb-0">
                  <p className="mb-3 text-sm font-extrabold text-navy-900">
                    {t.label}
                    {t.type === "list" && <span className="ms-2 font-normal text-muted">one item per line</span>}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {(["en", "ar"] as const).map((lang) => (
                      <label key={lang} className="grid gap-1.5">
                        <span className="w-fit rounded-md bg-paper px-2 py-0.5 text-[11px] font-bold tracking-wider text-muted uppercase">
                          {lang === "en" ? "English" : "Arabic · العربية"}
                        </span>
                        {t.type === "text" ? (
                          <input name={`${lang}:${t.key}`} defaultValue={lang === "en" ? t.valueEn : t.valueAr} dir={lang === "ar" ? "rtl" : "ltr"} className={inputCls} />
                        ) : (
                          <textarea
                            name={`${lang}:${t.key}`}
                            defaultValue={lang === "en" ? t.valueEn : t.valueAr}
                            dir={lang === "ar" ? "rtl" : "ltr"}
                            rows={t.type === "list" ? 7 : 4}
                            className={`${inputCls} leading-7`}
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end border-t border-line pt-5">
              <SubmitButton>
                <Save className="size-4" /> Save {TEXT_GROUPS[group]}
              </SubmitButton>
            </div>
          </Panel>
        </form>
      </div>
    </>
  );
}
