import { asc } from "drizzle-orm";
import { Save } from "lucide-react";
import { SubmitButton } from "@/components/admin/client";
import { btn, Field, inputCls, PageHeader, Panel } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { saveSettings } from "../../actions";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireUser();
  const rows = await db.select().from(schema.settings).orderBy(asc(schema.settings.sort));
  const groups = [...new Set(rows.map((r) => r.group))];
  const type = (t: string) => ({ email: "email", url: "url", phone: "tel" })[t] ?? "text";

  return (
    <>
      <PageHeader title="Settings" text="Contact details and social media links used across the website. Leave a social link empty to hide its icon. The office address and working hours are under Texts → Contact page." />
      <form action={saveSettings} className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {groups.map((group) => (
            <Panel key={group} title={group}>
              <div className="grid gap-4">
                {rows
                  .filter((r) => r.group === group)
                  .map((r) => (
                    <Field key={r.key} label={r.label}>
                      <input name={r.key} type={type(r.type)} defaultValue={r.value} dir="ltr" placeholder={r.type === "url" ? "https://..." : undefined} className={inputCls} />
                    </Field>
                  ))}
              </div>
            </Panel>
          ))}
        </div>
        <div className="flex justify-end">
          <SubmitButton className={`${btn.primary} px-6 py-3`}>
            <Save className="size-4" /> Save settings
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
