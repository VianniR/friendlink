"use client";

import { useTransition } from "react";
import { approveJoinRequest, rejectJoinRequest } from "@/actions/group";

export function JoinRequestButtons({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => startTransition(async () => { await approveJoinRequest(requestId); })}
        disabled={isPending}
        className="text-sm font-medium px-3 py-1.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
      >
        Approve
      </button>
      <button
        onClick={() => startTransition(async () => { await rejectJoinRequest(requestId); })}
        disabled={isPending}
        className="text-sm font-medium px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
      >
        Decline
      </button>
    </div>
  );
}
