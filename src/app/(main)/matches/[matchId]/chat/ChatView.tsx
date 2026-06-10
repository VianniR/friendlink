"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { sendMessage } from "@/actions/message";

type Message = {
  id: string;
  content: string;
  senderUserId: string;
  createdAt: string | Date;
  sender: { name: string | null; image: string | null };
};

type Props = {
  matchId: string;
  currentUserId: string;
  myGroupName: string;
  otherGroupName: string;
  initialMessages: Message[];
};

export function ChatView({
  matchId,
  currentUserId,
  myGroupName,
  otherGroupName,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Poll every 4 seconds
  useEffect(() => {
    const poll = () =>
      fetch(`/api/matches/${matchId}/messages`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setMessages(data);
        })
        .catch(() => {});

    const id = setInterval(poll, 4000);
    return () => clearInterval(id);
  }, [matchId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const trimmed = content.trim();
    if (!trimmed || isPending) return;
    setContent("");
    startTransition(async () => {
      await sendMessage(matchId, trimmed);
      // Immediately refresh after sending
      const res = await fetch(`/api/matches/${matchId}/messages`);
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 80px)" }}>
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-500 to-indigo-600 px-4 pt-6 pb-4 text-white shrink-0">
        <Link href="/matches" className="text-white/70 hover:text-white text-sm block mb-2">
          ← Matches
        </Link>
        <div>
          <p className="text-xs text-white/60 font-medium uppercase tracking-wide">
            {myGroupName}
          </p>
          <h1 className="text-xl font-bold leading-tight">{otherGroupName}</h1>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 text-sm text-center">
              You matched! Say hello to {otherGroupName}
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderUserId === currentUserId;
          const time = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isMe && (
                <Avatar src={msg.sender.image} name={msg.sender.name} size="sm" />
              )}

              <div className={`max-w-[72%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                {!isMe && (
                  <p className="text-xs text-slate-500 px-1">{msg.sender.name ?? "Member"}</p>
                )}
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-violet-600 text-white rounded-br-sm"
                      : "bg-white text-slate-900 shadow-sm border border-slate-100 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                <p className="text-xs text-slate-400 px-1">{time}</p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 bg-white border-t border-slate-200 px-4 py-3 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          rows={1}
          className="flex-1 resize-none px-4 py-2.5 border border-slate-300 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 max-h-28 overflow-y-auto"
          style={{ lineHeight: "1.4" }}
        />
        <button
          onClick={handleSend}
          disabled={!content.trim() || isPending}
          className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          aria-label="Send"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 translate-x-px"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
