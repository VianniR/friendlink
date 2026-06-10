"use client";

import { useState, useTransition } from "react";
import { createGroup, updateGroup } from "@/actions/group";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { InterestData } from "@/types";

type Props = {
  interests: InterestData[];
  // Edit mode — omit these to get create mode
  groupId?: string;
  initialName?: string;
  initialDescription?: string;
  initialCity?: string;
  initialJoinType?: "OPEN" | "REQUEST";
  initialInterestIds?: string[];
};

export function GroupForm({
  interests,
  groupId,
  initialName = "",
  initialDescription = "",
  initialCity = "",
  initialJoinType = "OPEN",
  initialInterestIds = [],
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [city, setCity] = useState(initialCity);
  const [joinType, setJoinType] = useState<"OPEN" | "REQUEST">(initialJoinType);
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(
    new Set(initialInterestIds),
  );
  const [isPending, startTransition] = useTransition();

  const isEditing = !!groupId;
  const categories = [...new Set(interests.map((i) => i.category))];

  function toggleInterest(id: string) {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name,
      description,
      interestIds: [...selectedInterests],
      city,
      joinType,
    };
    startTransition(async () => {
      if (isEditing) {
        await updateGroup(groupId, data);
      } else {
        await createGroup(data);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-4 py-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Group name *
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
          placeholder="e.g. The Hiking Crew"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description{" "}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={200}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none text-slate-900"
          placeholder="What does your group do? What are you looking for?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          City{" "}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
          placeholder="Your city"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Who can join?
        </label>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {(["OPEN", "REQUEST"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setJoinType(type)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                joinType === type
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {type === "OPEN" ? "Anyone" : "Approval required"}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-1.5">
          {joinType === "OPEN"
            ? "Anyone can join instantly"
            : "Members need your approval before joining"}
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Group interests
        </label>
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              {cat}
            </p>
            <div className="flex flex-wrap gap-2">
              {interests
                .filter((i) => i.category === cat)
                .map((interest) => (
                  <Badge
                    key={interest.id}
                    selected={selectedInterests.has(interest.id)}
                    onClick={() => toggleInterest(interest.id)}
                  >
                    {interest.name}
                  </Badge>
                ))}
            </div>
          </div>
        ))}
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={isPending || name.trim().length === 0}
      >
        {isPending
          ? isEditing ? "Saving..." : "Creating..."
          : isEditing ? "Save changes" : "Create group"}
      </Button>
    </form>
  );
}
