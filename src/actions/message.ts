"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function sendMessage(matchId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const trimmed = content.trim();
  if (!trimmed) return;

  const userId = session.user.id;

  const match = await db.groupMatch.findUnique({
    where: { id: matchId },
    select: {
      group1: { select: { members: { where: { userId }, select: { userId: true } } } },
      group2: { select: { members: { where: { userId }, select: { userId: true } } } },
    },
  });

  if (!match) throw new Error("Match not found");

  const isMember =
    match.group1.members.length > 0 || match.group2.members.length > 0;
  if (!isMember) throw new Error("Not authorized");

  await db.message.create({
    data: { matchId, senderUserId: userId, content: trimmed },
  });
}
