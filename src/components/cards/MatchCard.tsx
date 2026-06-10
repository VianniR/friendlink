import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { MapPin } from "lucide-react";
import { GroupActionsMenu } from "@/components/groups/GroupActionsMenu";

type MatchCardProps = {
  name: string | null;
  image: string | null;
  city: string | null;
  matchedAt: Date;
  isGroup?: boolean;
  chatHref?: string;
  groupId?: string;
};

export function MatchCard({ name, image, city, matchedAt, isGroup, chatHref, groupId }: MatchCardProps) {
  const when = new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.round((matchedAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    "day",
  );

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <Avatar src={image} name={name} size="lg" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 truncate">{name ?? "Unknown"}</p>
        {city && (
          <p className="text-xs text-slate-500 flex items-center gap-0.5">
            <MapPin className="w-3 h-3 shrink-0" />{city}
          </p>
        )}
        <p className="text-xs text-slate-400 mt-0.5">Matched {when}</p>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        {groupId && <GroupActionsMenu groupId={groupId} variant="light" />}
        {isGroup && (
          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full font-medium">
            Group
          </span>
        )}
        {chatHref && (
          <Link
            href={chatHref}
            className="text-xs font-medium text-violet-600 hover:text-violet-700 border border-violet-200 hover:border-violet-300 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            Message →
          </Link>
        )}
      </div>
    </div>
  );
}
