/**
 * Resets social data for a clean test run.
 * Keeps: users, accounts, sessions, interests, user interests, availability.
 * Clears: swipes, matches, groups, blocks, reports.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const [
    reports,
    blocks,
    groupMatches,
    groupSwipes,
    matches,
    swipes,
    groupInterests,
    groupMembers,
    groups,
  ] = await Promise.all([
    db.report.deleteMany(),
    db.block.deleteMany(),
    db.groupMatch.deleteMany(),
    db.groupSwipe.deleteMany(),
    db.match.deleteMany(),
    db.swipe.deleteMany(),
    db.groupInterest.deleteMany(),
    db.groupMember.deleteMany(),
    db.group.deleteMany(),
  ]);

  console.log("Reset complete:");
  console.log(`  ${swipes.count} swipes deleted`);
  console.log(`  ${matches.count} matches deleted`);
  console.log(`  ${groupSwipes.count} group swipes deleted`);
  console.log(`  ${groupMatches.count} group matches deleted`);
  console.log(`  ${groups.count} groups deleted`);
  console.log(`  ${blocks.count} blocks deleted`);
  console.log(`  ${reports.count} reports deleted`);

  const users = await db.user.findMany({ select: { name: true, email: true, onboarded: true } });
  console.log(`\nUsers remaining (${users.length}):`);
  users.forEach((u) => console.log(`  ${u.name ?? "unnamed"} <${u.email}> onboarded=${u.onboarded}`));
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
