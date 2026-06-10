"use client";

import { useState, useRef, useTransition } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { recordGroupSwipe } from "@/actions/swipe";
import { GroupCard } from "./GroupCard";
import { GroupDetailSheet } from "./GroupDetailSheet";
import { Globe, Sparkles, X, Heart } from "lucide-react";

const SWIPE_THRESHOLD = 120;

type GroupCandidate = {
  id: string;
  name: string;
  description: string | null;
  city: string | null;
  joinType: string;
  interests: { interest: { name: string; category: string } }[];
  members: { user: { name: string | null; image: string | null } }[];
};

export function GroupSwipeStack({
  candidates,
  fromGroupId,
}: {
  candidates: GroupCandidate[];
  fromGroupId: string;
}) {
  const [stack, setStack] = useState(candidates);
  const [matchedName, setMatchedName] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<GroupCandidate | null>(null);
  const [, startTransition] = useTransition();
  const dragStarted = useRef(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-18, 18]);
  const likeOpacity = useTransform(x, [30, SWIPE_THRESHOLD], [0, 1]);
  const passOpacity = useTransform(x, [-SWIPE_THRESHOLD, -30], [1, 0]);

  async function handleSwipe(direction: "LIKE" | "PASS") {
    if (stack.length === 0) return;
    const top = stack[0];

    const targetX = direction === "LIKE" ? 600 : -600;
    await animate(x, targetX, { duration: 0.28, ease: "easeIn" });

    setStack((prev) => prev.slice(1));
    x.set(0);

    startTransition(async () => {
      const result = await recordGroupSwipe(fromGroupId, top.id, direction);
      if (result?.matched) {
        setMatchedName(top.name);
        setTimeout(() => setMatchedName(null), 2800);
      }
    });
  }

  function handleBlock(groupId: string) {
    setStack((s) => s.filter((g) => g.id !== groupId));
  }

  // Called from detail sheet — no fly-off animation
  function handleQuickAction(direction: "LIKE" | "PASS") {
    if (stack.length === 0) return;
    const top = stack[0];
    setStack((prev) => prev.slice(1));
    startTransition(async () => {
      const result = await recordGroupSwipe(fromGroupId, top.id, direction);
      if (result?.matched) {
        setMatchedName(top.name);
        setTimeout(() => setMatchedName(null), 2800);
      }
    });
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    setTimeout(() => { dragStarted.current = false; }, 0);

    // Tiny movement — treat as tap, open detail sheet
    if (Math.abs(info.offset.x) < 8) {
      setExpandedGroup(stack[0]);
      animate(x, 0);
      return;
    }

    if (Math.abs(info.offset.x) >= SWIPE_THRESHOLD) {
      handleSwipe(info.offset.x > 0 ? "LIKE" : "PASS");
    } else {
      animate(x, 0, { duration: 0.25, ease: "easeOut" });
    }
  }

  if (stack.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-center px-8">
        <Globe className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-lg font-semibold text-slate-800">No more groups!</p>
        <p className="text-slate-500 text-sm mt-1">Check back later</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {matchedName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-8">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl w-full max-w-xs">
            <Sparkles className="w-12 h-12 text-violet-400 mb-3" />
            <p className="text-2xl font-bold text-violet-600">Group Match!</p>
            <p className="text-slate-600 mt-2">
              Your group and <span className="font-semibold">{matchedName}</span> liked
              each other
            </p>
          </div>
        </div>
      )}

      {/* Detail sheet */}
      {expandedGroup && (
        <GroupDetailSheet
          group={expandedGroup}
          onClose={() => setExpandedGroup(null)}
          onLike={() => {
            setExpandedGroup(null);
            handleQuickAction("LIKE");
          }}
          onPass={() => {
            setExpandedGroup(null);
            handleQuickAction("PASS");
          }}
          onBlock={() => {
            handleBlock(expandedGroup.id);
            setExpandedGroup(null);
          }}
        />
      )}

      <div className="relative" style={{ height: 420, width: 320 }}>
        {stack
          .slice(1, 3)
          .reverse()
          .map((group, i) => (
            <div
              key={group.id}
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: `scale(${0.94 - i * 0.03}) translateY(${(i + 1) * 10}px)`,
                zIndex: i,
                opacity: 0.7,
              }}
            >
              <GroupCard group={group} />
            </div>
          ))}

        <motion.div
          key={stack[0].id}
          style={{ x, rotate, zIndex: 10, position: "absolute", inset: 0 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.7}
          onDragStart={() => { dragStarted.current = true; }}
          onDragEnd={handleDragEnd}
          onClick={() => {
            if (!dragStarted.current) setExpandedGroup(stack[0]);
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          <motion.div
            className="absolute top-5 left-5 z-20 border-4 border-green-500 text-green-500 font-black text-xl px-3 py-1 rounded-lg -rotate-12"
            style={{ opacity: likeOpacity }}
          >
            LIKE
          </motion.div>
          <motion.div
            className="absolute top-5 right-5 z-20 border-4 border-red-500 text-red-500 font-black text-xl px-3 py-1 rounded-lg rotate-12"
            style={{ opacity: passOpacity }}
          >
            PASS
          </motion.div>
          <GroupCard group={stack[0]} onBlock={() => handleBlock(stack[0].id)} />
        </motion.div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => handleSwipe("PASS")}
          className="w-14 h-14 rounded-full bg-white shadow-lg border border-red-200 text-red-500 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          aria-label="Pass"
        >
          <X className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleSwipe("LIKE")}
          className="w-16 h-16 rounded-full bg-violet-600 shadow-lg text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          aria-label="Like"
        >
          <Heart className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
