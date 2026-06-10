import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { MapPin } from "lucide-react";

type Interest = { interest: { name: string; category: string } };

type UserCardProps = {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
    city: string | null;
    interests: Interest[];
  };
  onBlock?: () => void;
  onReport?: () => void;
};

export function UserCard({ user, onBlock, onReport }: UserCardProps) {
  const initials =
    user.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "??";

  return (
    <div className="w-80 rounded-2xl overflow-hidden shadow-xl bg-white select-none">
      {/* Photo / avatar header */}
      <div className="h-64 relative">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? ""}
            fill
            className="object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center">
            <span className="text-white text-6xl font-bold">{initials}</span>
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 leading-tight">
              {user.name ?? "Someone"}
            </h2>
            {user.city && (
              <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />{user.city}
              </p>
            )}
          </div>

          {(onBlock || onReport) && (
            <div className="relative group">
              <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                •••
              </button>
              <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-xl shadow-lg py-1 hidden group-focus-within:block z-10 min-w-32">
                {onBlock && (
                  <button
                    onClick={onBlock}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Block
                  </button>
                )}
                {onReport && (
                  <button
                    onClick={onReport}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Report
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {user.bio && (
          <p className="text-sm text-slate-700 line-clamp-2">{user.bio}</p>
        )}

        <div className="flex flex-wrap gap-1.5 pt-1">
          {user.interests.slice(0, 5).map((ui) => (
            <Badge key={ui.interest.name}>{ui.interest.name}</Badge>
          ))}
          {user.interests.length > 5 && (
            <Badge>+{user.interests.length - 5}</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
