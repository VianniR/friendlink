import { requireOnboarded } from "@/lib/auth";
import { db } from "@/lib/db";
import { getRankedGroupCandidates } from "@/lib/matching";
import { DiscoverView } from "@/components/cards/DiscoverView";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ groupId?: string }>;
}) {
  const session = await requireOnboarded();
  const { groupId: rawGroupId } = await searchParams;

  const userGroups = await db.group.findMany({
    where: { members: { some: { userId: session.user.id } } },
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  const activeGroupId =
    rawGroupId && userGroups.some((g) => g.id === rawGroupId)
      ? rawGroupId
      : (userGroups[0]?.id ?? null);

  const groupCandidates = activeGroupId
    ? await getRankedGroupCandidates(activeGroupId, session.user.id)
    : [];

  return (
    <DiscoverView
      userGroups={userGroups}
      groupCandidates={groupCandidates}
      activeGroupId={activeGroupId}
    />
  );
}
