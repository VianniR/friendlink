import { requireOnboarded } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { JoinGroupButton } from "@/components/groups/JoinGroupButton";
import { GroupActionsMenu } from "@/components/groups/GroupActionsMenu";
import { Users, Lock, MapPin } from "lucide-react";

export default async function GroupsPage() {
  const session = await requireOnboarded();
  const userId = session.user.id;

  const [myGroups, otherGroups, myRequests] = await Promise.all([
    db.group.findMany({
      where: { members: { some: { userId } } },
      include: {
        interests: { include: { interest: true } },
        members: { include: { user: { select: { name: true, image: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.group.findMany({
      where: { members: { none: { userId } } },
      include: {
        interests: { include: { interest: true } },
        members: { include: { user: { select: { name: true, image: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.groupJoinRequest.findMany({
      where: { userId, status: "PENDING" },
      select: { groupId: true },
    }),
  ]);

  const pendingGroupIds = new Set(myRequests.map((r) => r.groupId));

  return (
    <div className="px-4 pt-6 pb-4 space-y-8">
      {/* My Groups */}
      <section>
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Groups</h1>
            <p className="text-sm text-slate-500">Your groups and groups you can join</p>
          </div>
          <Link
            href="/groups/new"
            className="bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors"
          >
            + New
          </Link>
        </header>

        {myGroups.length === 0 ? (
          <div className="text-center py-10 space-y-2 bg-slate-50 rounded-2xl">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-800">No groups yet</p>
            <p className="text-slate-500 text-sm">Create one or join a group below</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myGroups.map((g) => (
              <GroupRow key={g.id} group={g} linkable />
            ))}
          </div>
        )}
      </section>

      {/* Browse */}
      {otherGroups.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Browse ({otherGroups.length})
          </h2>
          <div className="space-y-3">
            {otherGroups.map((g) => (
              <GroupRow
                key={g.id}
                group={g}
                linkable
                joinType={g.joinType as "OPEN" | "REQUEST"}
                pendingRequest={pendingGroupIds.has(g.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

type GroupData = {
  id: string;
  name: string;
  city: string | null;
  description: string | null;
  joinType?: string;
  interests: { interestId: string; interest: { name: string } }[];
  members: { user: { name: string | null; image: string | null } }[];
};

function GroupRow({
  group,
  linkable,
  joinType,
  pendingRequest,
}: {
  group: GroupData;
  linkable?: boolean;
  joinType?: "OPEN" | "REQUEST";
  pendingRequest?: boolean;
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
        {group.name[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-slate-900">{group.name}</p>
          {joinType === "REQUEST" && (
            <Lock className="w-3 h-3 text-slate-400 shrink-0" />
          )}
        </div>
        {group.city && (
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" />{group.city}
          </p>
        )}
        {group.description && (
          <p className="text-sm text-slate-600 mt-0.5 line-clamp-1">{group.description}</p>
        )}
        <div className="flex flex-wrap gap-1 mt-1.5">
          {group.interests.slice(0, 3).map((gi) => (
            <Badge key={gi.interestId}>{gi.interest.name}</Badge>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        {joinType && <GroupActionsMenu groupId={group.id} variant="light" />}
        <div className="flex -space-x-1.5">
          {group.members.slice(0, 3).map((m, i) => (
            <Avatar key={i} src={m.user.image} name={m.user.name} size="sm" />
          ))}
        </div>
        {joinType && (
          <JoinGroupButton
            groupId={group.id}
            joinType={joinType}
            existingRequestStatus={pendingRequest ? "PENDING" : null}
          />
        )}
      </div>
    </div>
  );

  if (linkable) {
    return (
      <Link
        href={`/groups/${group.id}`}
        className="block bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:border-violet-200 transition-colors"
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">{inner}</div>
  );
}
