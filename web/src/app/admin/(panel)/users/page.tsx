import { asc } from "drizzle-orm";
import { KeyRound, Trash2, UserPlus } from "lucide-react";
import { ConfirmButton, SubmitButton } from "@/components/admin/client";
import { Badge, Field, inputCls, PageHeader, Panel } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { addUser, changePassword, deleteUser } from "../../actions";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  const me = await requireUser();
  const users = await db
    .select({ id: schema.users.id, name: schema.users.name, email: schema.users.email, createdAt: schema.users.createdAt })
    .from(schema.users)
    .orderBy(asc(schema.users.name));

  return (
    <>
      <PageHeader title="Users & password" text="People who can sign in to this dashboard." />
      <div className="grid gap-6 lg:grid-cols-5">
        <Panel title="Dashboard users" className="lg:col-span-3" padded={false}>
          <ul className="divide-y divide-line">
            {users.map((u) => (
              <li key={u.id} className="flex items-center gap-4 px-6 py-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-navy-700 font-extrabold text-white">{u.name.slice(0, 1).toUpperCase()}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-extrabold text-navy-900">
                    {u.name} {u.id === me.id && <Badge tone="blue">you</Badge>}
                  </span>
                  <span className="block truncate text-sm text-muted">{u.email}</span>
                </span>
                {u.id !== me.id && (
                  <form action={deleteUser}>
                    <input type="hidden" name="id" value={u.id} />
                    <ConfirmButton message={`Delete ${u.name}? They will no longer be able to sign in.`}>
                      <Trash2 className="size-4" />
                    </ConfirmButton>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </Panel>

        <div className="grid gap-6 lg:col-span-2">
          <Panel title="Add a user">
            <form action={addUser} className="grid gap-4">
              <Field label="Name">
                <input name="name" required className={inputCls} />
              </Field>
              <Field label="Email">
                <input name="email" type="email" required className={inputCls} />
              </Field>
              <Field label="Password" hint="At least 10 characters">
                <input name="password" type="password" required minLength={10} autoComplete="new-password" className={inputCls} />
              </Field>
              <SubmitButton>
                <UserPlus className="size-4" /> Add user
              </SubmitButton>
            </form>
          </Panel>
          <Panel title="Change your password">
            <form action={changePassword} className="grid gap-4">
              <Field label="Current password">
                <input name="current" type="password" required autoComplete="current-password" className={inputCls} />
              </Field>
              <Field label="New password" hint="At least 10 characters">
                <input name="password" type="password" required minLength={10} autoComplete="new-password" className={inputCls} />
              </Field>
              <Field label="Confirm new password">
                <input name="confirm" type="password" required minLength={10} autoComplete="new-password" className={inputCls} />
              </Field>
              <SubmitButton>
                <KeyRound className="size-4" /> Change password
              </SubmitButton>
            </form>
          </Panel>
        </div>
      </div>
    </>
  );
}
