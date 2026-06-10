import { requireOnboarded } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ChatView } from "./ChatView";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const session = await requireOnboarded();
  const { matchId } = await params;
  const userId = session.user.id;

  const match = await db.groupMatch.findUnique({
    where: { id: matchId },
    select: {
      id: true,
      group1: {
        select: {
          id: true,
          name: true,
          members: { where: { userId }, select: { userId: true } },
        },
      },
      group2: {
        select: {
          id: true,
          name: true,
          members: { where: { userId }, select: { userId: true } },
        },
      },
    },
  });

  if (!match) notFound();

  const inGroup1 = match.group1.members.length > 0;
  const inGroup2 = match.group2.members.length > 0;
  if (!inGroup1 && !inGroup2) notFound();

  const myGroup = inGroup1 ? match.group1 : match.group2;
  const otherGroup = inGroup1 ? match.group2 : match.group1;

  const initialMessages = await db.message.findMany({
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

  return (
    <ChatView
      matchId={matchId}
      currentUserId={userId}
      myGroupName={myGroup.name}
      otherGroupName={otherGroup.name}
      initialMessages={initialMessages}
    />
  );
}
