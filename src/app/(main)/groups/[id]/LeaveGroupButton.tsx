"use client";

import { useTransition } from "react";
import { leaveGroup } from "@/actions/group";
import { Button } from "@/components/ui/Button";

export function LeaveGroupButton({ groupId }: { groupId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      onClick={() =>
        startTransition(async () => {
          await leaveGroup(groupId);
        })
      }
      disabled={isPending}
    >
      {isPending ? "Leaving..." : "Leave group"}
    </Button>
  );
}
