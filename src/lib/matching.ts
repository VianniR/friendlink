import { db } from "./db";

type UserWithData = {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  interests: { interestId: string }[];
  availability: { day: number; slot: string }[];
};

type GroupWithData = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  city: string | null;
  interests: { interestId: string; interest: { name: string; category: string } }[];
  members: {
    user: {
      name: string | null;
      image: string | null;
      interests: { interestId: string }[];
      availability: { day: number; slot: string }[];
    };
  }[];
};

// ── Score helpers ────────────────────────────────────────────────────────────

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  const intersection = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return intersection / union;
}

function scheduleOverlap(
  a: { day: number; slot: string }[],
  b: { day: number; slot: string }[],
): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a.map((x) => `${x.day}-${x.slot}`));
  const setB = new Set(b.map((x) => `${x.day}-${x.slot}`));
  const shared = [...setA].filter((k) => setB.has(k)).length;
  return shared / Math.min(setA.size, setB.size);
}

function proximityScore(
  cityA: string | null,
  cityB: string | null,
): number {
  if (!cityA || !cityB) return 0;
  return cityA.trim().toLowerCase() === cityB.trim().toLowerCase() ? 1 : 0;
}

// ── User-user scoring ────────────────────────────────────────────────────────

export function scoreUsers(viewer: UserWithData, candidate: UserWithData): number {
  const vInterests = new Set(viewer.interests.map((i) => i.interestId));
  const cInterests = new Set(candidate.interests.map((i) => i.interestId));

  const interest = jaccardSimilarity(vInterests, cInterests);
  const schedule = scheduleOverlap(viewer.availability, candidate.availability);
  const proximity = proximityScore(viewer.city, candidate.city);

  return 0.4 * interest + 0.35 * schedule + 0.25 * proximity;
}

// ── Group-group scoring ──────────────────────────────────────────────────────

function aggregateGroupInterests(group: GroupWithData): Set<string> {
  return new Set(group.interests.map((i) => i.interestId));
}

function aggregateGroupAvailability(
  group: GroupWithData,
): { day: number; slot: string }[] {
  const seen = new Set<string>();
  const result: { day: number; slot: string }[] = [];
  for (const member of group.members) {
    for (const slot of member.user.availability) {
      const key = `${slot.day}-${slot.slot}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(slot);
      }
    }
  }
  return result;
}

export function scoreGroups(source: GroupWithData, target: GroupWithData): number {
  const sInterests = aggregateGroupInterests(source);
  const tInterests = aggregateGroupInterests(target);
  const interest = jaccardSimilarity(sInterests, tInterests);

  const sAvail = aggregateGroupAvailability(source);
  const tAvail = aggregateGroupAvailability(target);
  const schedule = scheduleOverlap(sAvail, tAvail);

  const proximity = proximityScore(source.city, target.city);

  return 0.4 * interest + 0.35 * schedule + 0.25 * proximity;
}

// ── Candidate fetching ───────────────────────────────────────────────────────

export async function getRankedCandidates(userId: string) {
  const [viewer, swipedIds, blockedRelations] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        city: true,
        lat: true,
        lng: true,
        interests: { select: { interestId: true } },
        availability: { select: { day: true, slot: true } },
      },
    }),
    db.swipe
      .findMany({ where: { fromUserId: userId }, select: { toUserId: true } })
      .then((rows) => rows.map((r) => r.toUserId)),
    db.block
      .findMany({
        where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
        select: { blockerId: true, blockedId: true },
      })
      .then((rows) =>
        rows.map((r) => (r.blockerId === userId ? r.blockedId : r.blockerId)),
      ),
  ]);

  if (!viewer) return [];

  const excludeIds = new Set([userId, ...swipedIds, ...blockedRelations]);

  const candidates = await db.user.findMany({
    where: {
      onboarded: true,
      id: { notIn: [...excludeIds] },
    },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      city: true,
      lat: true,
      lng: true,
      interests: {
        select: {
          interestId: true,
          interest: { select: { name: true, category: true } },
        },
      },
      availability: { select: { day: true, slot: true } },
    },
  });

  return candidates
    .map((c) => ({ ...c, score: scoreUsers(viewer, c) }))
    .sort((a, b) => b.score - a.score);
}

export async function getRankedGroupCandidates(groupId: string, userId: string) {
  const [source, swipedIds, blockedRelations, blockedGroupIds] = await Promise.all([
    db.group.findUnique({
      where: { id: groupId },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        city: true,
        interests: {
          select: {
            interestId: true,
            interest: { select: { name: true, category: true } },
          },
        },
        members: {
          select: {
            user: {
              select: {
                name: true,
                image: true,
                interests: { select: { interestId: true } },
                availability: { select: { day: true, slot: true } },
              },
            },
          },
        },
      },
    }),
    db.groupSwipe
      .findMany({ where: { fromGroupId: groupId }, select: { toGroupId: true } })
      .then((rows) => rows.map((r) => r.toGroupId)),
    db.block
      .findMany({
        where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
        select: { blockerId: true, blockedId: true },
      })
      .then((rows) =>
        rows.map((r) => (r.blockerId === userId ? r.blockedId : r.blockerId)),
      ),
    db.groupBlock
      .findMany({ where: { userId }, select: { groupId: true } })
      .then((rows) => rows.map((r) => r.groupId)),
  ]);

  if (!source) return [];

  const excludeIds = new Set([groupId, ...swipedIds, ...blockedGroupIds]);

  const candidates = await db.group.findMany({
    where: {
      id: { notIn: [...excludeIds] },
      // exclude groups containing blocked users
      members: { none: { userId: { in: blockedRelations } } },
    },
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      city: true,
      joinType: true,
      interests: {
        select: {
          interestId: true,
          interest: { select: { name: true, category: true } },
        },
      },
      members: {
        select: {
          user: {
            select: {
              name: true,
              image: true,
              interests: { select: { interestId: true } },
              availability: { select: { day: true, slot: true } },
            },
          },
        },
      },
    },
  });

  return candidates
    .map((c) => ({ ...c, score: scoreGroups(source, c) }))
    .sort((a, b) => b.score - a.score);
}
