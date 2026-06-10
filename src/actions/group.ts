"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type CreateGroupData = {
  name: string;
  description: string;
  interestIds: string[];
  city: string;
  joinType: "OPEN" | "REQUEST";
};

export async function createGroup(data: CreateGroupData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const userId = session.user.id;

  const group = await db.$transaction(async (tx) => {
    const g = await tx.group.create({
      data: {
        name: data.name.trim(),
        description: data.description.trim() || null,
        city: data.city.trim() || null,
        joinType: data.joinType,
      },
    });

    await tx.groupMember.create({
      data: { userId, groupId: g.id, role: "OWNER" },
    });

    if (data.interestIds.length > 0) {
      await tx.groupInterest.createMany({
        data: data.interestIds.map((interestId) => ({ groupId: g.id, interestId })),
      });
    }

    return g;
  });

  revalidatePath("/groups");
  redirect(`/groups/${group.id}`);
}

export async function joinGroup(groupId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await db.groupMember.upsert({
    where: { userId_groupId: { userId: session.user.id, groupId } },
    create: { userId: session.user.id, groupId, role: "MEMBER" },
    update: {},
  });

  revalidatePath("/groups");
  revalidatePath(`/groups/${groupId}`);
}

export async function requestToJoin(groupId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await db.groupJoinRequest.upsert({
    where: { userId_groupId: { userId: session.user.id, groupId } },
    create: { userId: session.user.id, groupId, status: "PENDING" },
    update: { status: "PENDING" },
  });

  revalidatePath("/groups");
}

export async function approveJoinRequest(requestId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const request = await db.groupJoinRequest.findUnique({
    where: { id: requestId },
    include: { group: { include: { members: true } } },
  });
  if (!request) throw new Error("Request not found");

  const isOwner = request.group.members.some(
    (m) => m.userId === session.user.id && m.role === "OWNER",
  );
  if (!isOwner) throw new Error("Not authorized");

  await db.$transaction([
    db.groupJoinRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED" },
    }),
    db.groupMember.upsert({
      where: { userId_groupId: { userId: request.userId, groupId: request.groupId } },
      create: { userId: request.userId, groupId: request.groupId, role: "MEMBER" },
      update: {},
    }),
  ]);

  revalidatePath(`/groups/${request.groupId}`);
}

export async function rejectJoinRequest(requestId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const request = await db.groupJoinRequest.findUnique({
    where: { id: requestId },
    include: { group: { include: { members: true } } },
  });
  if (!request) throw new Error("Request not found");

  const isOwner = request.group.members.some(
    (m) => m.userId === session.user.id && m.role === "OWNER",
  );
  if (!isOwner) throw new Error("Not authorized");

  await db.groupJoinRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED" },
  });

  revalidatePath(`/groups/${request.groupId}`);
}

export async function updateGroup(groupId: string, data: CreateGroupData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const member = await db.groupMember.findFirst({
    where: { groupId, userId: session.user.id, role: "OWNER" },
  });
  if (!member) throw new Error("Not authorized");

  await db.$transaction(async (tx) => {
    await tx.group.update({
      where: { id: groupId },
      data: {
        name: data.name.trim(),
        description: data.description.trim() || null,
        city: data.city.trim() || null,
        joinType: data.joinType,
      },
    });

    await tx.groupInterest.deleteMany({ where: { groupId } });

    if (data.interestIds.length > 0) {
      await tx.groupInterest.createMany({
        data: data.interestIds.map((interestId) => ({ groupId, interestId })),
      });
    }
  });

  revalidatePath("/groups");
  revalidatePath(`/groups/${groupId}`);
  redirect(`/groups/${groupId}`);
}

export async function deleteGroup(groupId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const member = await db.groupMember.findFirst({
    where: { groupId, userId: session.user.id, role: "OWNER" },
  });
  if (!member) throw new Error("Not authorized");

  await db.group.delete({ where: { id: groupId } });

  revalidatePath("/groups");
  redirect("/groups");
}

export async function leaveGroup(groupId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await db.groupMember.delete({
    where: { userId_groupId: { userId: session.user.id, groupId } },
  });

  revalidatePath("/groups");
  redirect("/groups");
}
