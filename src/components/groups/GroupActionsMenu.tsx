"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal } from "lucide-react";
import { blockGroup } from "@/actions/safety";
import { ReportForm } from "@/components/forms/ReportForm";

type Props = {
  groupId: string;
  onBlock?: () => void;
  variant?: "light" | "dark";
};

export function GroupActionsMenu({ groupId, onBlock, variant = "light" }: Props) {
  const [open, setOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [, startTransition] = useTransition();

  function handleBlock() {
    setOpen(false);
    startTransition(async () => {
      await blockGroup(groupId);
      onBlock?.();
    });
  }

  const btnClass =
    variant === "dark"
      ? "text-white/70 hover:text-white hover:bg-white/20"
      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100";

  return (
    <>
      <div className="relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${btnClass}`}
          aria-label="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            />
            <div className="absolute right-0 top-9 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-20 min-w-32">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBlock();
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Block
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  setShowReport(true);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Report
              </button>
            </div>
          </>
        )}
      </div>

      <ReportForm
        open={showReport}
        onClose={() => setShowReport(false)}
        targetGroupId={groupId}
      />
    </>
  );
}
