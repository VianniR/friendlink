"use client";

import { useState, useRef, useTransition } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { recordSwipe } from "@/actions/swipe";
import { UserCard } from "./UserCard";
import { UserDetailSheet } from "./UserDetailSheet";
import { ReportForm } from "@/components/forms/ReportForm";
import { blockUser } from "@/actions/safety";
import { Globe, Sparkles, X, Heart } from "lucide-react";

const SWIPE_THRESHOLD = 120;

type Candidate = {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  city: string | null;
  interests: { interest: { name: string; category: string } }[];
  availability: { day: number; slot: string }[];
};

export function SwipeStack({ candidates }: { candidates: Candidate[] }) {
  const [stack, setStack] = useState(candidates);
  const [matchedName, setMatchedName] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [expandedUser, setExpandedUser] = useState<Candidate | null>(null);
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
      const result = await recordSwipe(top.id, direction);
      if (result?.matched) {
        setMatchedName(top.name);
        setTimeout(() => setMatchedName(null), 2800);
      }
    });
  }

  // Called from detail sheet — no fly-off animation
  function handleQuickAction(direction: "LIKE" | "PASS") {
    if (stack.length === 0) return;
    const top = stack[0];
    setStack((prev) => prev.slice(1));
    startTransition(async () => {
      const result = await recordSwipe(top.id, direction);
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
      setExpandedUser(stack[0]);
      animate(x, 0);
      return;
    }

    if (Math.abs(info.offset.x) >= SWIPE_THRESHOLD) {
      handleSwipe(info.offset.x > 0 ? "LIKE" : "PASS");
    } else {
      animate(x, 0, { duration: 0.25, ease: "easeOut" });
    }
  }

  function handleBlock() {
    if (stack.length === 0) return;
    const top = stack[0];
    setStack((prev) => prev.slice(1));
    x.set(0);
    startTransition(async () => {
      await blockUser(top.id);
    });
  }

  if (stack.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center px-8">
        <Globe className="w-12 h-12 text-slate-300 mb-4" />
        <p className="text-xl font-semibold text-slate-800">You've seen everyone!</p>
        <p className="text-slate-500 mt-1 text-sm">Check back later for new people</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 pt-4 pb-8">
      {/* Match overlay */}
      {matchedName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-8">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl w-full max-w-xs">
            <Sparkles className="w-12 h-12 text-violet-400 mb-3" />
            <p className="text-2xl font-bold text-violet-600">It's a Match!</p>
            <p className="text-slate-600 mt-2">
              You and <span className="font-semibold">{matchedName}</span> liked each other
            </p>
          </div>
        </div>
      )}

      {/* Report modal */}
      {showReport && stack[0] && (
        <ReportForm
          open={showReport}
          onClose={() => setShowReport(false)}
          targetUserId={stack[0].id}
        />
      )}

      {/* Detail sheet */}
      {expandedUser && (
        <UserDetailSheet
          user={expandedUser}
          onClose={() => setExpandedUser(null)}
          onLike={() => {
            setExpandedUser(null);
            handleQuickAction("LIKE");
          }}
          onPass={() => {
            setExpandedUser(null);
            handleQuickAction("PASS");
          }}
        />
      )}

      {/* Card stack */}
      <div className="relative" style={{ height: 420, width: 320 }}>
        {/* Background ghost cards */}
        {stack
          .slice(1, 3)
          .reverse()
          .map((user, i) => (
            <div
              key={user.id}
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: `scale(${0.94 - i * 0.03}) translateY(${(i + 1) * 10}px)`,
                zIndex: i,
                opacity: 0.7,
              }}
            >
              <UserCard user={user} />
            </div>
          ))}

        {/* Top draggable card */}
        <motion.div
          key={stack[0].id}
          style={{ x, rotate, zIndex: 10, position: "absolute", inset: 0 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.7}
          onDragStart={() => { dragStarted.current = true; }}
          onDragEnd={handleDragEnd}
          onClick={() => {
            if (!dragStarted.current) setExpandedUser(stack[0]);
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          {/* LIKE label */}
          <motion.div
            className="absolute top-5 left-5 z-20 border-4 border-green-500 text-green-500 font-black text-xl px-3 py-1 rounded-lg -rotate-12"
            style={{ opacity: likeOpacity }}
          >
            LIKE
          </motion.div>

          {/* PASS label */}
          <motion.div
            className="absolute top-5 right-5 z-20 border-4 border-red-500 text-red-500 font-black text-xl px-3 py-1 rounded-lg rotate-12"
            style={{ opacity: passOpacity }}
          >
            PASS
          </motion.div>

          <UserCard
            user={stack[0]}
            onBlock={handleBlock}
            onReport={() => setShowReport(true)}
          />
        </motion.div>
      </div>

      {/* Action buttons */}
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
