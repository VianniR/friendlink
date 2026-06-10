import { requireOnboarded } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { GroupForm } from "@/components/forms/GroupForm";

export default async function EditGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireOnboarded();
  const { id } = await params;

  const [group, interests] = await Promise.all([
    db.group.findUnique({
      where: { id },
      include: {
        interests: true,
        members: { where: { userId: session.user.id } },
      },
    }),
    db.interest.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
  ]);

  if (!group) notFound();

  const isOwner = group.members.some((m) => m.role === "OWNER");
  if (!isOwner) redirect(`/groups/${id}`);

  return (
    <div>
      <div className="px-4 pt-6 pb-2">
        <Link
          href={`/groups/${id}`}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to group
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Edit group</h1>
      </div>

      <GroupForm
        interests={interests}
        groupId={id}
        initialName={group.name}
        initialDescription={group.description ?? ""}
        initialCity={group.city ?? ""}
        initialJoinType={group.joinType as "OPEN" | "REQUEST"}
        initialInterestIds={group.interests.map((gi) => gi.interestId)}
      />
    </div>
  );
}
