"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Lock, Check, MapPin, X, Heart } from "lucide-react";
import { GroupActionsMenu } from "@/components/groups/GroupActionsMenu";

type GroupCandidate = {
  id: string;
  name: string;
  description: string | null;
  city: string | null;
  joinType: string;
  interests: { interest: { name: string; category: string } }[];
  members: { user: { name: string | null; image: string | null } }[];
};

type Props = {
  group: GroupCandidate;
  onClose: () => void;
  onLike: () => void;
  onPass: () => void;
  onBlock?: () => void;
};

export function GroupDetailSheet({ group, onClose, onLike, onPass, onBlock }: Props) {
  const byCategory = group.interests.reduce<Record<string, string[]>>(
    (acc, gi) => {
      const cat = gi.interest.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(gi.interest.name);
      return acc;
    },
    {},
  );

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] flex flex-col"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-48 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-t-3xl flex items-center justify-center relative shrink-0">
          <span className="text-white text-7xl font-bold">
            {group.name[0].toUpperCase()}
          </span>
          <div className="absolute top-4 left-4">
            <GroupActionsMenu
              groupId={group.id}
              onBlock={() => { onBlock?.(); onClose(); }}
              variant="dark"
            />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4 pb-28">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">{group.name}</h2>
              {group.joinType === "REQUEST" ? (
                <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  <Lock className="w-3 h-3 shrink-0" />Approval required
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  <Check className="w-3 h-3 shrink-0" />Open
                </span>
              )}
            </div>
            {group.city && (
              <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />{group.city}
              </p>
            )}
          </div>

          {group.description && (
            <p className="text-sm text-slate-700 leading-relaxed">
              {group.description}
            </p>
          )}

          {/* Interests by category */}
          {Object.keys(byCategory).length > 0 && (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Interests
              </p>
              {Object.entries(byCategory).map(([cat, names]) => (
                <div key={cat}>
                  <p className="text-xs text-slate-400 mb-1">{cat}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {names.map((n) => (
                      <Badge key={n}>{n}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Members */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Members ({group.members.length})
            </p>
            <div className="space-y-2">
              {group.members.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar src={m.user.image} name={m.user.name} size="sm" />
                  <span className="text-sm text-slate-800">
                    {m.user.name ?? "Member"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky action buttons */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-8 py-4 flex items-center justify-center gap-8">
          <button
            onClick={onPass}
            className="w-14 h-14 rounded-full bg-white shadow-lg border border-red-200 text-red-500 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            aria-label="Pass"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={onLike}
            className="w-16 h-16 rounded-full bg-violet-600 shadow-lg text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            aria-label="Like"
          >
            <Heart className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
