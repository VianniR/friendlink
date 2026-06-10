import { requireOnboarded } from "@/lib/auth";
import { db } from "@/lib/db";
import { MatchCard } from "@/components/cards/MatchCard";
import { Users } from "lucide-react";

export default async function MatchesPage() {
  const session = await requireOnboarded();
  const userId = session.user.id;

  const [myGroupIds, groupMatches] = await Promise.all([
    db.groupMember
      .findMany({ where: { userId }, select: { groupId: true } })
      .then((rows) => new Set(rows.map((r) => r.groupId))),
    db.groupMatch.findMany({
      where: {
        OR: [
          { group1: { members: { some: { userId } } } },
          { group2: { members: { some: { userId } } } },
        ],
      },
      include: {
        group1: { select: { id: true, name: true, image: true, city: true } },
        group2: { select: { id: true, name: true, image: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="px-4 pt-6 pb-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Matches</h1>
        <p className="text-sm text-slate-500">Groups that liked your group back</p>
      </header>

      {groupMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-2">
          <Users className="w-12 h-12 text-slate-300" />
          <p className="font-semibold text-slate-800">No matches yet</p>
          <p className="text-slate-500 text-sm">Head to Discover and start swiping as your group</p>
        </div>
      ) : (
        <div className="space-y-2">
          {groupMatches.map((m) => {
            const other = myGroupIds.has(m.group1.id) ? m.group2 : m.group1;
            return (
              <MatchCard
                key={m.id}
                name={other.name}
                image={other.image}
                city={other.city}
                matchedAt={m.createdAt}
                isGroup
                chatHref={`/matches/${m.id}/chat`}
                groupId={other.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
