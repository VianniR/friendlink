import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ matchId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { matchId } = await params;
  const userId = session.user.id;

  const match = await db.groupMatch.findUnique({
    where: { id: matchId },
    select: {
      group1: { select: { members: { where: { userId }, select: { userId: true } } } },
      group2: { select: { members: { where: { userId }, select: { userId: true } } } },
    },
  });

  if (!match) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isMember =
    match.group1.members.length > 0 || match.group2.members.length > 0;
  if (!isMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const messages = await db.message.findMany({
    where: { matchId },
    select: {
      id: true,
      content: true,
      senderUserId: true,
      createdAt: true,
      sender: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}
