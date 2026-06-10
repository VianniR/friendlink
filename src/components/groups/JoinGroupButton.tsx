"use client";

import { useTransition } from "react";
import { joinGroup, requestToJoin } from "@/actions/group";

type Props = {
  groupId: string;
  joinType: "OPEN" | "REQUEST";
  existingRequestStatus?: "PENDING" | "APPROVED" | "REJECTED" | null;
};

export function JoinGroupButton({ groupId, joinType, existingRequestStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  if (existingRequestStatus === "PENDING") {
    return (
      <span className="shrink-0 text-sm font-medium px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 cursor-default">
        Requested
      </span>
    );
  }

  if (joinType === "REQUEST") {
    return (
      <button
        onClick={() => startTransition(async () => { await requestToJoin(groupId); })}
        disabled={isPending}
        className="shrink-0 text-sm font-medium px-3 py-1.5 rounded-xl border border-violet-600 text-violet-600 hover:bg-violet-50 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Sending..." : "Request to join"}
      </button>
    );
  }

  return (
    <button
      onClick={() => startTransition(async () => { await joinGroup(groupId); })}
      disabled={isPending}
      className="shrink-0 text-sm font-medium px-3 py-1.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
    >
      {isPending ? "Joining..." : "Join"}
    </button>
  );
}
