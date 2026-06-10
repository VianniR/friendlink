"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function blockUser(blockedId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const blockerId = session.user.id;
  if (blockerId === blockedId) return;

  await db.block.upsert({
    where: { blockerId_blockedId: { blockerId, blockedId } },
    create: { blockerId, blockedId },
    update: {},
  });

  revalidatePath("/discover");
}

export async function reportUser(reportedUserId: string, reason: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await db.report.create({
    data: { reporterId: session.user.id, reportedUserId, reason },
  });
}

export async function reportGroup(reportedGroupId: string, reason: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await db.report.create({
    data: { reporterId: session.user.id, reportedGroupId, reason },
  });
}

export async function blockGroup(groupId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const userId = session.user.id;

  await db.groupBlock.upsert({
    where: { userId_groupId: { userId, groupId } },
    create: { userId, groupId },
    update: {},
  });

  revalidatePath("/discover");
  revalidatePath("/groups");
}
