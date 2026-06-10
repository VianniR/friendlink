"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function recordSwipe(
  toUserId: string,
  direction: "LIKE" | "PASS",
): Promise<{ matched: boolean }> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const fromUserId = session.user.id;

  await db.swipe.upsert({
    where: { fromUserId_toUserId: { fromUserId, toUserId } },
    create: { fromUserId, toUserId, direction },
    update: { direction },
  });

  if (direction === "LIKE") {
    const reciprocal = await db.swipe.findFirst({
      where: { fromUserId: toUserId, toUserId: fromUserId, direction: "LIKE" },
    });

    if (reciprocal) {
      // Normalize order to prevent duplicates
      const [user1Id, user2Id] = [fromUserId, toUserId].sort();
      await db.match.upsert({
        where: { user1Id_user2Id: { user1Id, user2Id } },
        create: { user1Id, user2Id },
        update: {},
      });
      revalidatePath("/matches");
      return { matched: true };
    }
  }

  return { matched: false };
}

export async function recordGroupSwipe(
  fromGroupId: string,
  toGroupId: string,
  direction: "LIKE" | "PASS",
): Promise<{ matched: boolean }> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  // Verify the user is a member of the fromGroup
  const membership = await db.groupMember.findFirst({
    where: { groupId: fromGroupId, userId: session.user.id },
  });
  if (!membership) throw new Error("Not a group member");

  await db.groupSwipe.upsert({
    where: { fromGroupId_toGroupId: { fromGroupId, toGroupId } },
    create: { fromGroupId, toGroupId, direction },
    update: { direction },
  });

  if (direction === "LIKE") {
    const reciprocal = await db.groupSwipe.findFirst({
      where: { fromGroupId: toGroupId, toGroupId: fromGroupId, direction: "LIKE" },
    });

    if (reciprocal) {
      const [group1Id, group2Id] = [fromGroupId, toGroupId].sort();
      await db.groupMatch.upsert({
        where: { group1Id_group2Id: { group1Id, group2Id } },
        create: { group1Id, group2Id },
        update: {},
      });
      revalidatePath("/matches");
      return { matched: true };
    }
  }

  return { matched: false };
}
