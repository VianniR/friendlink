import { requireOnboarded } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { LeaveGroupButton } from "./LeaveGroupButton";
import { JoinRequestButtons } from "./JoinRequestButtons";
import { DeleteGroupButton } from "./DeleteGroupButton";
import { Lock, MapPin } from "lucide-react";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireOnboarded();
  const { id } = await params;

  const group = await db.group.findUnique({
    where: { id },
    include: {
      interests: { include: { interest: true } },
      members: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { role: "asc" },
      },
      joinRequests: {
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          user: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });

  if (!group) notFound();

  const isMember = group.members.some((m) => m.userId === session.user.id);
  const isOwner = group.members.some(
    (m) => m.userId === session.user.id && m.role === "OWNER",
  );

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-500 to-indigo-600 px-4 pt-6 pb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <Link href="/groups" className="text-white/70 hover:text-white text-sm">
            ← Groups
          </Link>
          {isOwner && (
            <Link
              href={`/groups/${id}/edit`}
              className="text-sm font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
            >
              Edit
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
            {group.name[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{group.name}</h1>
              {group.joinType === "REQUEST" && (
                <span className="inline-flex items-center gap-1 text-sm bg-white/20 px-2 py-0.5 rounded-full">
                  <Lock className="w-3.5 h-3.5 shrink-0" />Approval
                </span>
              )}
            </div>
            {group.city && (
              <p className="text-white/80 text-sm flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />{group.city}
              </p>
            )}
            <p className="text-white/70 text-xs mt-0.5">
              {group.members.length} member{group.members.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-6">
        {group.description && (
          <p className="text-slate-700">{group.description}</p>
        )}

        {/* Pending join requests — owner only */}
        {isOwner && group.joinRequests.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
            <p className="text-sm font-semibold text-amber-800">
              Join Requests ({group.joinRequests.length})
            </p>
            {group.joinRequests.map((req) => (
              <div key={req.id} className="flex items-center gap-3">
                <Avatar src={req.user.image} name={req.user.name} size="sm" />
                <span className="text-sm text-slate-800 flex-1">{req.user.name ?? "User"}</span>
                <JoinRequestButtons requestId={req.id} />
              </div>
            ))}
          </div>
        )}

        {/* Interests */}
        {group.interests.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Interests
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.interests.map((gi) => (
                <Badge key={gi.interestId}>{gi.interest.name}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Members */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Members
          </p>
          <div className="space-y-2">
            {group.members.map((m) => (
              <div key={m.userId} className="flex items-center gap-3">
                <Avatar src={m.user.image} name={m.user.name} size="sm" />
                <span className="text-sm text-slate-800">{m.user.name ?? "User"}</span>
                {m.role === "OWNER" && (
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                    Owner
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {isMember && !isOwner && <LeaveGroupButton groupId={id} />}

        {isMember && (
          <div className="bg-violet-50 rounded-2xl p-4">
            <p className="text-sm font-medium text-slate-800">Ready to find matches?</p>
            <p className="text-sm text-slate-500 mt-0.5">
              Head to Discover to swipe as{" "}
              <span className="font-medium text-violet-700">{group.name}</span>.
            </p>
            <Link
              href={`/discover?groupId=${id}`}
              className="inline-block mt-3 text-sm font-medium text-violet-600 hover:text-violet-700"
            >
              Go to Discover →
            </Link>
          </div>
        )}

        {isOwner && (
          <div className="pt-2 border-t border-slate-100">
            <DeleteGroupButton groupId={id} groupName={group.name} />
          </div>
        )}
      </div>
    </div>
  );
}
