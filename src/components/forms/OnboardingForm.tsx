"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { completeOnboarding } from "@/actions/onboarding";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Check } from "lucide-react";
import type { InterestData } from "@/types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SLOTS = ["MORNING", "AFTERNOON", "EVENING"];
const SLOT_LABELS: Record<string, string> = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
};

type Props = {
  interests: InterestData[];
  initialName: string;
  initialImage: string | null;
  initialBio?: string;
  initialCity?: string;
  initialInterestIds?: string[];
  initialAvailability?: { day: number; slot: string }[];
  isEditing?: boolean;
};

export function OnboardingForm({
  interests,
  initialName,
  initialImage,
  initialBio = "",
  initialCity = "",
  initialInterestIds = [],
  initialAvailability = [],
  isEditing,
}: Props) {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(
    new Set(initialInterestIds),
  );
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(
    new Set(initialAvailability.map((a) => `${a.day}-${a.slot}`)),
  );
  const [city, setCity] = useState(initialCity);

  const categories = [...new Set(interests.map((i) => i.category))];

  function toggleInterest(id: string) {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSlot(day: number, slot: string) {
    const key = `${day}-${slot}`;
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function handleSubmit() {
    const availability = [...selectedSlots].map((key) => {
      const [day, slot] = key.split("-");
      return { day: Number(day), slot };
    });

    startTransition(async () => {
      await completeOnboarding({
        name,
        bio,
        interestIds: [...selectedInterests],
        availability,
        city,
        redirectTo: isEditing ? "/profile" : "/groups",
      });
    });
  }

  const canProceed = [
    name.trim().length > 0,
    selectedInterests.size >= 3,
    selectedSlots.size > 0,
    true,
  ][step - 1];

  return (
    <div className="flex flex-col h-full">
      {/* Back link when editing an existing profile */}
      {isEditing && (
        <div className="px-4 pt-4">
          <Link href="/profile" className="text-sm text-slate-500 hover:text-slate-700">
            ← Back to profile
          </Link>
        </div>
      )}

      {/* Progress bar */}
      <div className="flex gap-1.5 p-4 pt-3">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-violet-600" : "bg-slate-200"}`}
          />
        ))}
      </div>

      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Hey there!</h2>
              <p className="text-slate-500 mt-1">Tell us a bit about yourself</p>
            </div>

            <div className="flex justify-center">
              <Avatar src={initialImage} name={name} size="xl" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Your name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bio{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={160}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none text-slate-900"
                  placeholder="What are you into? What kind of friends are you looking for?"
                />
                <p className="text-xs text-slate-400 mt-1 text-right">{bio.length}/160</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Your interests</h2>
              <p className="text-slate-500 mt-1">
                Pick at least 3 — these power your matches
              </p>
            </div>

            {categories.map((cat) => (
              <div key={cat}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
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

            {selectedInterests.size < 3 && (
              <p className="text-sm text-red-500">
                Select at least {3 - selectedInterests.size} more
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">When are you free?</h2>
              <p className="text-slate-500 mt-1">
                We use this to match your group with others who share your schedule
              </p>
            </div>

            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-center text-sm">
                <thead>
                  <tr>
                    <th className="w-12" />
                    {SLOTS.map((slot) => (
                      <th key={slot} className="pb-2 font-medium text-slate-600 text-xs">
                        {SLOT_LABELS[slot]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((day, dayIndex) => (
                    <tr key={day}>
                      <td className="py-1 text-xs font-medium text-slate-500 text-left pl-2">
                        {day}
                      </td>
                      {SLOTS.map((slot) => {
                        const key = `${dayIndex}-${slot}`;
                        const selected = selectedSlots.has(key);
                        return (
                          <td key={slot} className="py-1 px-1">
                            <button
                              onClick={() => toggleSlot(dayIndex, slot)}
                              className={`w-full py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${
                                selected
                                  ? "bg-violet-600 text-white"
                                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              }`}
                            >
                              {selected ? <Check className="w-3 h-3" /> : null}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedSlots.size === 0 && (
              <p className="text-sm text-red-500">Select at least one time slot</p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Where are you?</h2>
              <p className="text-slate-500 mt-1">
                Help us find people nearby
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                City{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
                placeholder="e.g. San Luis Obispo"
              />
            </div>

            <div className="bg-violet-50 rounded-xl p-4 space-y-1">
              <p className="font-medium text-slate-800">Almost done!</p>
              <p className="text-sm text-slate-600">
                {name} · {selectedInterests.size} interests · {selectedSlots.size} time
                slots{city ? ` · ${city}` : ""}
              </p>
              {!isEditing && (
                <p className="text-sm text-violet-700 mt-2">
                  After setup, your next step is to create or join a group — that's how matching works here.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="px-6 pb-8 pt-4 flex gap-3">
        {step > 1 && (
          <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}
        {step < 4 ? (
          <Button fullWidth disabled={!canProceed} onClick={() => setStep((s) => s + 1)}>
            Continue
          </Button>
        ) : (
          <Button fullWidth disabled={isPending} onClick={handleSubmit}>
            {isPending ? "Saving..." : isEditing ? "Save changes" : "Create my profile →"}
          </Button>
        )}
      </div>
    </div>
  );
}
