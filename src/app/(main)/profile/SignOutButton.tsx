"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      fullWidth
      onClick={() => signOut({ callbackUrl: "/signin" })}
      className="text-slate-500"
    >
      Sign out
    </Button>
  );
}
