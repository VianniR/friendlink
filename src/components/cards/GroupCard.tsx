import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { MapPin } from "lucide-react";
import { GroupActionsMenu } from "@/components/groups/GroupActionsMenu";

type GroupCardProps = {
  group: {
    id: string;
    name: string;
    description: string | null;
    city: string | null;
    interests: { interest: { name: string; category: string } }[];
    members: { user: { name: string | null; image: string | null } }[];
  };
  onBlock?: () => void;
};

export function GroupCard({ group, onBlock }: GroupCardProps) {
  return (
    <div className="w-80 rounded-2xl overflow-hidden shadow-xl bg-white select-none">
      {/* Header */}
      <div className="h-48 bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center relative">
        <span className="text-white text-7xl font-bold">
          {group.name[0].toUpperCase()}
        </span>
        <div className="absolute top-3 right-3">
          <GroupActionsMenu groupId={group.id} onBlock={onBlock} variant="dark" />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{group.name}</h2>
          {group.city && (
            <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />{group.city}
            </p>
          )}
        </div>

        {group.description && (
          <p className="text-sm text-slate-700 line-clamp-2">{group.description}</p>
        )}

        <div className="flex flex-wrap gap-1.5 pt-1">
          {group.interests.slice(0, 4).map((gi) => (
            <Badge key={gi.interest.name}>{gi.interest.name}</Badge>
          ))}
        </div>

        {/* Member avatars */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex -space-x-1.5">
            {group.members.slice(0, 4).map((m, i) => (
              <Avatar key={i} src={m.user.image} name={m.user.name} size="sm" />
            ))}
          </div>
          <span className="text-xs text-slate-500">
            {group.members.length} member{group.members.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
