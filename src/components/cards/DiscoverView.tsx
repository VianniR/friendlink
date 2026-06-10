"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { GroupSwipeStack } from "./GroupSwipeStack";
import { Users } from "lucide-react";

type UserGroup = { id: string; name: string };

type GroupCandidate = {
  id: string;
  name: string;
  description: string | null;
  city: string | null;
  joinType: string;
  interests: { interest: { name: string; category: string } }[];
  members: { user: { name: string | null; image: string | null } }[];
};

type Props = {
  userGroups: UserGroup[];
  groupCandidates: GroupCandidate[];
  activeGroupId: string | null;
};

export function DiscoverView({ userGroups, groupCandidates, activeGroupId }: Props) {
  const router = useRouter();

  function switchGroup(groupId: string) {
    router.push(`/discover?groupId=${groupId}`);
  }

  return (
    <div>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-slate-900">Discover</h1>
        <p className="text-sm text-slate-500 mt-0.5">Find groups to match with</p>
      </header>

      {userGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 text-center px-8 space-y-3 mt-4">
          <Users className="w-12 h-12 text-slate-300" />
          <p className="text-lg font-semibold text-slate-800">You're not in any groups yet</p>
          <p className="text-slate-500 text-sm">
            Create or join a group to start discovering matches
          </p>
          <Link
            href="/groups"
            className="mt-2 bg-violet-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors text-sm"
          >
            Go to Groups
          </Link>
        </div>
      ) : (
        <>
          {/* Group picker — only shown when user is in multiple groups */}
          {userGroups.length > 1 && (
            <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
              {userGroups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => switchGroup(g.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    g.id === activeGroupId
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          )}

          {/* Label showing which group is swiping */}
          {activeGroupId && userGroups.length === 1 && (
            <p className="px-4 pb-2 text-sm text-slate-500">
              Swiping as{" "}
              <span className="font-medium text-slate-700">{userGroups[0].name}</span>
            </p>
          )}

          {activeGroupId ? (
            <GroupSwipeStack candidates={groupCandidates} fromGroupId={activeGroupId} />
          ) : (
            <p className="text-center text-slate-400 text-sm py-12">Select a group above</p>
          )}
        </>
      )}
    </div>
  );
}
