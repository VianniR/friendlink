import { requireOnboarded } from "@/lib/auth";
import { db } from "@/lib/db";
import { GroupForm } from "@/components/forms/GroupForm";
import Link from "next/link";

export default async function NewGroupPage() {
  await requireOnboarded();

  const interests = await db.interest.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <header className="flex items-center gap-3 px-4 pt-6 pb-2">
        <Link href="/groups" className="text-slate-500 hover:text-slate-700">
          ←
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Create a Group</h1>
      </header>

      <GroupForm interests={interests} />
    </div>
  );
}
