"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { reportUser, reportGroup } from "@/actions/safety";

const REASONS = [
  "Inappropriate content",
  "Spam or fake profile",
  "Harassment",
  "Underage user",
  "Other",
];

type Props =
  | { open: boolean; onClose: () => void; targetUserId: string; targetGroupId?: never }
  | { open: boolean; onClose: () => void; targetGroupId: string; targetUserId?: never };

export function ReportForm({ open, onClose, targetUserId, targetGroupId }: Props) {
  const [reason, setReason] = useState(REASONS[0]);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    startTransition(async () => {
      if (targetUserId) {
        await reportUser(targetUserId, reason);
      } else if (targetGroupId) {
        await reportGroup(targetGroupId, reason);
      }
      onClose();
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="Report">
      <p className="text-sm text-slate-600">
        Help us understand what's going on. This report is anonymous.
      </p>
      <div className="space-y-2">
        {REASONS.map((r) => (
          <label key={r} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="reason"
              value={r}
              checked={reason === r}
              onChange={() => setReason(r)}
              className="accent-violet-600"
            />
            <span className="text-sm text-slate-700">{r}</span>
          </label>
        ))}
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onClose} fullWidth>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSubmit} disabled={isPending} fullWidth>
          {isPending ? "Sending..." : "Submit"}
        </Button>
      </div>
    </Modal>
  );
}
