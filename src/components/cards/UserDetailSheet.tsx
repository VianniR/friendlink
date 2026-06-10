"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { MapPin, X, Heart } from "lucide-react";

type Candidate = {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  city: string | null;
  interests: { interest: { name: string; category: string } }[];
  availability: { day: number; slot: string }[];
};

type Props = {
  user: Candidate;
  onClose: () => void;
  onLike: () => void;
  onPass: () => void;
};

const DAYS = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
const SLOTS = [
  { key: "MORNING", label: "AM" },
  { key: "AFTERNOON", label: "PM" },
  { key: "EVENING", label: "Eve" },
];

export function UserDetailSheet({ user, onClose, onLike, onPass }: Props) {
  const initials =
    user.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "??";

  const byCategory = user.interests.reduce<Record<string, string[]>>(
    (acc, ui) => {
      const cat = ui.interest.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(ui.interest.name);
      return acc;
    },
    {},
  );

  const availSet = new Set(
    user.availability.map((a) => `${a.day}-${a.slot}`),
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
        {/* Header: photo or initials */}
        <div className="h-56 relative rounded-t-3xl overflow-hidden shrink-0">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? ""}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center">
              <span className="text-white text-7xl font-bold">{initials}</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4 pb-28">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{user.name ?? "Someone"}</h2>
            {user.city && (
              <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />{user.city}
              </p>
            )}
          </div>

          {user.bio && (
            <p className="text-sm text-slate-700 leading-relaxed">{user.bio}</p>
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

          {/* Availability grid */}
          {user.availability.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Availability
              </p>
              <div className="grid grid-cols-8 gap-1 mb-1">
                <div />
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-xs text-slate-400">
                    {d}
                  </div>
                ))}
              </div>
              {SLOTS.map(({ key, label }) => (
                <div key={key} className="grid grid-cols-8 gap-1 mb-1">
                  <div className="text-xs text-slate-400 flex items-center justify-end pr-1">
                    {label}
                  </div>
                  {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                    <div key={day} className="flex items-center justify-center">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          availSet.has(`${day}-${key}`)
                            ? "bg-violet-500"
                            : "bg-slate-100"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
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
