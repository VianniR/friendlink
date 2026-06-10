"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type OnboardingData = {
  name: string;
  bio: string;
  interestIds: string[];
  availability: { day: number; slot: string }[];
  city: string;
  redirectTo?: string;
};

export async function completeOnboarding(data: OnboardingData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const userId = session.user.id;

  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: {
        name: data.name.trim(),
        bio: data.bio.trim() || null,
        city: data.city.trim() || null,
        onboarded: true,
      },
    }),
    db.userInterest.deleteMany({ where: { userId } }),
    db.userInterest.createMany({
      data: data.interestIds.map((interestId) => ({ userId, interestId })),
    }),
    db.availability.deleteMany({ where: { userId } }),
    db.availability.createMany({
      data: data.availability.map(({ day, slot }) => ({ userId, day, slot })),
    }),
  ]);

  const destination = data.redirectTo ?? "/groups";
  revalidatePath(destination);
  redirect(destination);
}
