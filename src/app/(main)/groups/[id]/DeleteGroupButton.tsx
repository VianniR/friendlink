"use client";

import { useState, useTransition } from "react";
import { deleteGroup } from "@/actions/group";

export function DeleteGroupButton({
  groupId,
  groupName,
}: {
  groupId: string;
  groupName: string;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-sm font-medium text-red-600 hover:text-red-700"
      >
        Delete group
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-semibold text-slate-900 text-lg">
              Delete &ldquo;{groupName}&rdquo;?
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              This permanently removes the group, all members, and match history. This
              cannot be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  startTransition(async () => {
                    await deleteGroup(groupId);
                  })
                }
                disabled={isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
