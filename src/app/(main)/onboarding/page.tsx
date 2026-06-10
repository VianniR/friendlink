import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { OnboardingForm } from "@/components/forms/OnboardingForm";

export default async function OnboardingPage() {
  const session = await requireAuth();

  const [interests, user] = await Promise.all([
    db.interest.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    db.user.findUnique({
      where: { id: session.user.id },
      include: {
        interests: true,
        availability: true,
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <OnboardingForm
        interests={interests}
        initialName={user?.name ?? session.user.name ?? ""}
        initialImage={user?.image ?? session.user.image ?? null}
        initialBio={user?.bio ?? ""}
        initialCity={user?.city ?? ""}
        initialInterestIds={user?.interests.map((i) => i.interestId) ?? []}
        initialAvailability={user?.availability.map((a) => ({ day: a.day, slot: a.slot })) ?? []}
        isEditing={user?.onboarded ?? false}
      />
    </div>
  );
}
