import { requireOnboarded } from "@/lib/auth";
import { db } from "@/lib/db";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { SignOutButton } from "./SignOutButton";
import Link from "next/link";
import { MapPin } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SLOT_LABELS: Record<string, string> = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
};

export default async function ProfilePage() {
  const session = await requireOnboarded();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      interests: { include: { interest: true } },
      availability: { orderBy: [{ day: "asc" }, { slot: "asc" }] },
      _count: {
        select: {
          matchesAs1: true,
          matchesAs2: true,
          memberships: true,
        },
      },
    },
  });

  if (!user) return null;

  const totalMatches = user._count.matchesAs1 + user._count.matchesAs2;

  return (
    <div className="px-4 pt-6 pb-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar src={user.image} name={user.name} size="xl" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
          {user.city && (
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />{user.city}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Matches", value: totalMatches },
          { label: "Groups", value: user._count.memberships },
          { label: "Interests", value: user.interests.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-violet-50 rounded-2xl p-3 text-center"
          >
            <p className="text-2xl font-bold text-violet-700">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Bio */}
      {user.bio && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Bio
          </p>
          <p className="text-slate-700 text-sm">{user.bio}</p>
        </div>
      )}

      {/* Interests */}
      {user.interests.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Interests
          </p>
          <div className="flex flex-wrap gap-1.5">
            {user.interests.map((ui) => (
              <Badge key={ui.interestId}>{ui.interest.name}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      {user.availability.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Availability
          </p>
          <div className="flex flex-wrap gap-1.5">
            {user.availability.map((a) => (
              <span
                key={`${a.day}-${a.slot}`}
                className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
              >
                {DAYS[a.day]} {SLOT_LABELS[a.slot] ?? a.slot}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Edit link */}
      <Link
        href="/onboarding"
        className="block w-full text-center py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        Edit profile
      </Link>

      <SignOutButton />
    </div>
  );
}
