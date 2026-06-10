import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// ---------------------------------------------------------------------------
// Interests
// ---------------------------------------------------------------------------

const interestData = [
  { name: "Basketball", category: "Sports" },
  { name: "Soccer", category: "Sports" },
  { name: "Tennis", category: "Sports" },
  { name: "Running", category: "Sports" },
  { name: "Volleyball", category: "Sports" },
  { name: "Painting", category: "Arts" },
  { name: "Photography", category: "Arts" },
  { name: "Film", category: "Arts" },
  { name: "Writing", category: "Arts" },
  { name: "Theater", category: "Arts" },
  { name: "Coding", category: "Tech" },
  { name: "Gaming", category: "Tech" },
  { name: "AI / ML", category: "Tech" },
  { name: "Design", category: "Tech" },
  { name: "Robotics", category: "Tech" },
  { name: "Cooking", category: "Food" },
  { name: "Baking", category: "Food" },
  { name: "Coffee", category: "Food" },
  { name: "Food Tours", category: "Food" },
  { name: "Wine & Cocktails", category: "Food" },
  { name: "Guitar", category: "Music" },
  { name: "Piano", category: "Music" },
  { name: "DJing", category: "Music" },
  { name: "Concerts", category: "Music" },
  { name: "Singing", category: "Music" },
  { name: "Hiking", category: "Outdoors" },
  { name: "Camping", category: "Outdoors" },
  { name: "Cycling", category: "Outdoors" },
  { name: "Beach", category: "Outdoors" },
  { name: "Rock Climbing", category: "Outdoors" },
];

// ---------------------------------------------------------------------------
// Users
// day: 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
// slot: MORNING | AFTERNOON | EVENING
// ---------------------------------------------------------------------------

const userData = [
  {
    email: "marco.reyes@example.com",
    name: "Marco Reyes",
    bio: "CS junior building things during the day and finding trails on weeknights. Always down for pickup volleyball if the weather cooperates.",
    city: "San Luis Obispo",
    interests: ["Coding", "Hiking", "Volleyball", "AI / ML"],
    availability: [
      { day: 1, slot: "EVENING" },
      { day: 3, slot: "EVENING" },
      { day: 5, slot: "EVENING" },
      { day: 6, slot: "MORNING" },
      { day: 6, slot: "AFTERNOON" },
    ],
  },
  {
    email: "priya.nair@example.com",
    name: "Priya Nair",
    bio: "Architecture student with too many sketchbooks. I photograph anything that casts an interesting shadow.",
    city: "San Luis Obispo",
    interests: ["Design", "Photography", "Film", "Painting"],
    availability: [
      { day: 2, slot: "AFTERNOON" },
      { day: 4, slot: "AFTERNOON" },
      { day: 0, slot: "MORNING" },
      { day: 0, slot: "AFTERNOON" },
      { day: 0, slot: "EVENING" },
      { day: 6, slot: "MORNING" },
      { day: 6, slot: "AFTERNOON" },
      { day: 6, slot: "EVENING" },
    ],
  },
  {
    email: "jake.morrow@example.com",
    name: "Jake Morrow",
    bio: "I bartend Tue–Sat, so Sunday and Monday are mine. Hiking, playing mediocre guitar, and finding the best coffee in SLO.",
    city: "San Luis Obispo",
    interests: ["Guitar", "Concerts", "Coffee", "Hiking", "Wine & Cocktails"],
    availability: [
      { day: 0, slot: "MORNING" },
      { day: 0, slot: "AFTERNOON" },
      { day: 0, slot: "EVENING" },
      { day: 1, slot: "MORNING" },
      { day: 1, slot: "AFTERNOON" },
      { day: 1, slot: "EVENING" },
    ],
  },
  {
    email: "sofia.chen@example.com",
    name: "Sofia Chen",
    bio: "Transferred from UC Davis last year. Still figuring out SLO but very open to recommendations, especially for food.",
    city: "Morro Bay",
    interests: ["Cooking", "Baking", "Coffee", "Food Tours"],
    availability: [
      { day: 1, slot: "EVENING" },
      { day: 2, slot: "EVENING" },
      { day: 3, slot: "EVENING" },
      { day: 4, slot: "EVENING" },
      { day: 0, slot: "AFTERNOON" },
    ],
  },
  {
    email: "liam.torres@example.com",
    name: "Liam Torres",
    bio: "ME grad student building robots during the week and riding my bike along the coast on weekends. Looking for people into either.",
    city: "San Luis Obispo",
    interests: ["Robotics", "Cycling", "Running", "Coding"],
    availability: [
      { day: 1, slot: "EVENING" },
      { day: 3, slot: "EVENING" },
      { day: 5, slot: "EVENING" },
      { day: 6, slot: "MORNING" },
      { day: 0, slot: "MORNING" },
    ],
  },
  {
    email: "aisha.grant@example.com",
    name: "Aisha Grant",
    bio: "Environmental science major. If I'm not in the field I'm somewhere outside anyway. Bishop Peak is basically my backyard.",
    city: "San Luis Obispo",
    interests: ["Hiking", "Camping", "Beach", "Rock Climbing"],
    availability: [
      { day: 2, slot: "MORNING" },
      { day: 4, slot: "MORNING" },
      { day: 6, slot: "MORNING" },
      { day: 6, slot: "AFTERNOON" },
      { day: 6, slot: "EVENING" },
      { day: 0, slot: "MORNING" },
      { day: 0, slot: "AFTERNOON" },
      { day: 0, slot: "EVENING" },
    ],
  },
  {
    email: "tyler.kim@example.com",
    name: "Tyler Kim",
    bio: "Music major. Piano is my main thing but I'll show up to basically any live show. If you play something, let's figure out a collab.",
    city: "San Luis Obispo",
    interests: ["Piano", "Guitar", "Concerts", "Singing"],
    availability: [
      { day: 1, slot: "EVENING" },
      { day: 3, slot: "EVENING" },
      { day: 6, slot: "AFTERNOON" },
      { day: 0, slot: "AFTERNOON" },
    ],
  },
  {
    email: "natalie.cruz@example.com",
    name: "Natalie Cruz",
    bio: "Paso Robles local. I work harvest at a vineyard every fall and spend the rest of the year eating well and hiking off the calories.",
    city: "Paso Robles",
    interests: ["Wine & Cocktails", "Food Tours", "Hiking", "Coffee"],
    availability: [
      { day: 3, slot: "EVENING" },
      { day: 6, slot: "MORNING" },
      { day: 6, slot: "AFTERNOON" },
      { day: 6, slot: "EVENING" },
      { day: 0, slot: "MORNING" },
      { day: 0, slot: "AFTERNOON" },
    ],
  },
  {
    email: "devon.park@example.com",
    name: "Devon Park",
    bio: "Kinesiology senior. Morning workouts are non-negotiable. Basketball at the Rec Center Thursday nights — DM if you want in.",
    city: "San Luis Obispo",
    interests: ["Basketball", "Volleyball", "Running", "Soccer"],
    availability: [
      { day: 1, slot: "MORNING" },
      { day: 2, slot: "MORNING" },
      { day: 3, slot: "MORNING" },
      { day: 4, slot: "MORNING" },
      { day: 5, slot: "MORNING" },
      { day: 4, slot: "EVENING" },
    ],
  },
  {
    email: "zoe.abbott@example.com",
    name: "Zoe Abbott",
    bio: "I shoot 35mm and make short docs on the side. Looking for subjects, collaborators, or just people who want to watch something weird.",
    city: "San Luis Obispo",
    interests: ["Photography", "Film", "Writing"],
    availability: [
      { day: 5, slot: "EVENING" },
      { day: 6, slot: "EVENING" },
      { day: 0, slot: "AFTERNOON" },
    ],
  },
  {
    email: "carlos.mendez@example.com",
    name: "Carlos Mendez",
    bio: "Born and raised in Paso. Weekend rides up to Cholame, wine tasting on Fridays, dinner with whoever wants to cook.",
    city: "Paso Robles",
    interests: ["Cycling", "Wine & Cocktails", "Cooking", "Hiking"],
    availability: [
      { day: 5, slot: "EVENING" },
      { day: 6, slot: "MORNING" },
      { day: 6, slot: "AFTERNOON" },
      { day: 0, slot: "MORNING" },
      { day: 0, slot: "AFTERNOON" },
    ],
  },
  {
    email: "emma.walsh@example.com",
    name: "Emma Walsh",
    bio: "Nursing student at Cuesta. I paint to decompress and bake when I'm procrastinating. Currently deep in a sourdough phase.",
    city: "Atascadero",
    interests: ["Painting", "Baking", "Coffee", "Theater"],
    availability: [
      { day: 1, slot: "EVENING" },
      { day: 3, slot: "EVENING" },
      { day: 0, slot: "MORNING" },
    ],
  },
  {
    email: "ryan.hughes@example.com",
    name: "Ryan Hughes",
    bio: "Software engineer at a startup downtown. Remote hours mean I'm usually hiking or at the bouldering gym by 2pm.",
    city: "San Luis Obispo",
    interests: ["Coding", "AI / ML", "Rock Climbing", "Gaming"],
    availability: [
      { day: 2, slot: "AFTERNOON" },
      { day: 4, slot: "AFTERNOON" },
      { day: 6, slot: "MORNING" },
    ],
  },
  {
    email: "maya.singh@example.com",
    name: "Maya Singh",
    bio: "Graphic design and marketing. I go to too many concerts and take too many photos at them. Always looking for show buddies.",
    city: "San Luis Obispo",
    interests: ["Design", "Photography", "Concerts", "DJing"],
    availability: [
      { day: 5, slot: "EVENING" },
      { day: 6, slot: "EVENING" },
      { day: 0, slot: "AFTERNOON" },
    ],
  },
  {
    email: "jack.winters@example.com",
    name: "Jack Winters",
    bio: "Pismo local. Surf, beach soccer, occasional camping. Not a morning person but I'll be there by 10.",
    city: "Pismo Beach",
    interests: ["Beach", "Soccer", "Camping", "Rock Climbing"],
    availability: [
      { day: 4, slot: "EVENING" },
      { day: 6, slot: "AFTERNOON" },
      { day: 0, slot: "AFTERNOON" },
    ],
  },
  {
    email: "lily.tran@example.com",
    name: "Lily Tran",
    bio: "Pre-med. Coffee is a food group at this point. Morning runs, Sunday cooking sessions, trying to have a life in between.",
    city: "San Luis Obispo",
    interests: ["Coffee", "Running", "Cooking", "Tennis"],
    availability: [
      { day: 1, slot: "MORNING" },
      { day: 2, slot: "MORNING" },
      { day: 3, slot: "MORNING" },
      { day: 4, slot: "MORNING" },
      { day: 5, slot: "MORNING" },
      { day: 0, slot: "AFTERNOON" },
    ],
  },
  {
    email: "brendan.cole@example.com",
    name: "Brendan Cole",
    bio: "CS PhD student. My research is in machine learning but half my mental energy goes to thinking about movies. Big Tarkovsky guy.",
    city: "San Luis Obispo",
    interests: ["AI / ML", "Coding", "Film", "Writing"],
    availability: [
      { day: 2, slot: "EVENING" },
      { day: 6, slot: "MORNING" },
      { day: 6, slot: "AFTERNOON" },
      { day: 6, slot: "EVENING" },
      { day: 0, slot: "MORNING" },
      { day: 0, slot: "AFTERNOON" },
      { day: 0, slot: "EVENING" },
    ],
  },
  {
    email: "jasmine.moore@example.com",
    name: "Jasmine Moore",
    bio: "Theater and creative writing double major. I write plays, act in them, then overthink them. Looking for people who take art seriously.",
    city: "San Luis Obispo",
    interests: ["Theater", "Singing", "Writing", "Film"],
    availability: [
      { day: 1, slot: "EVENING" },
      { day: 3, slot: "EVENING" },
      { day: 5, slot: "EVENING" },
      { day: 6, slot: "AFTERNOON" },
    ],
  },
  {
    email: "alex.rivera@example.com",
    name: "Alex Rivera",
    bio: "Grew up playing soccer. I coach a youth team Saturdays and play pickup Sundays. Also really into cycling lately — blame the coast.",
    city: "Arroyo Grande",
    interests: ["Soccer", "Basketball", "Cycling", "Running"],
    availability: [
      { day: 0, slot: "MORNING" },
      { day: 0, slot: "AFTERNOON" },
      { day: 1, slot: "EVENING" },
      { day: 3, slot: "EVENING" },
    ],
  },
  {
    email: "hannah.beck@example.com",
    name: "Hannah Beck",
    bio: "Grew up in Morro Bay, know every trail and tide pool. I paint landscapes and teach surf lessons in summer. Very much a beach person.",
    city: "Morro Bay",
    interests: ["Beach", "Painting", "Hiking", "Camping"],
    availability: [
      { day: 4, slot: "AFTERNOON" },
      { day: 6, slot: "MORNING" },
      { day: 6, slot: "AFTERNOON" },
      { day: 6, slot: "EVENING" },
      { day: 0, slot: "MORNING" },
      { day: 0, slot: "AFTERNOON" },
      { day: 0, slot: "EVENING" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Groups
// ---------------------------------------------------------------------------

type GroupSeed = {
  name: string;
  description: string;
  city: string;
  joinType: "OPEN" | "REQUEST";
  interests: string[];
  ownerEmail: string;
  memberEmails: string[];
};

const groupData: GroupSeed[] = [
  {
    name: "SLO Hiking & Peaks",
    description:
      "Bishop Peak every other week, longer day hikes on weekends. All fitness levels welcome — just don't ghost on hike day.",
    city: "San Luis Obispo",
    joinType: "OPEN",
    interests: ["Hiking", "Camping", "Rock Climbing"],
    ownerEmail: "aisha.grant@example.com",
    memberEmails: [
      "marco.reyes@example.com",
      "hannah.beck@example.com",
      "jake.morrow@example.com",
    ],
  },
  {
    name: "Central Coast Coders",
    description:
      "Weekly sessions, project collabs, and the occasional hackathon. A mix of students and working devs. Apply to join.",
    city: "San Luis Obispo",
    joinType: "REQUEST",
    interests: ["Coding", "AI / ML", "Design"],
    ownerEmail: "ryan.hughes@example.com",
    memberEmails: [
      "marco.reyes@example.com",
      "brendan.cole@example.com",
      "liam.torres@example.com",
    ],
  },
  {
    name: "Vine & Dine Collective",
    description:
      "A winery or bottle share once a month, plus pop-up dinners where someone cooks and everyone brings wine. Paso-based but SLO welcome.",
    city: "Paso Robles",
    joinType: "REQUEST",
    interests: ["Wine & Cocktails", "Food Tours", "Cooking"],
    ownerEmail: "carlos.mendez@example.com",
    memberEmails: [
      "natalie.cruz@example.com",
      "jake.morrow@example.com",
      "sofia.chen@example.com",
    ],
  },
  {
    name: "SLO Film Club",
    description:
      "Monthly screenings at someone's place, occasional SLOIFF trips, and a group chat that's mostly movie arguments. Join if you have opinions.",
    city: "San Luis Obispo",
    joinType: "OPEN",
    interests: ["Film", "Writing", "Photography"],
    ownerEmail: "zoe.abbott@example.com",
    memberEmails: [
      "brendan.cole@example.com",
      "maya.singh@example.com",
      "jasmine.moore@example.com",
    ],
  },
  {
    name: "Mustang Pickup Sports",
    description:
      "Basketball Tue/Thu nights at the Rec Center, volleyball Saturday mornings at the beach. No commitment required — just show up.",
    city: "San Luis Obispo",
    joinType: "OPEN",
    interests: ["Basketball", "Volleyball", "Soccer", "Running"],
    ownerEmail: "devon.park@example.com",
    memberEmails: [
      "alex.rivera@example.com",
      "jack.winters@example.com",
      "marco.reyes@example.com",
    ],
  },
  {
    name: "Coast Cyclists",
    description:
      "Road rides, gravel rides, and the occasional century. We pace for the group so no one gets dropped. Mostly weekend mornings.",
    city: "Morro Bay",
    joinType: "OPEN",
    interests: ["Cycling", "Beach", "Hiking"],
    ownerEmail: "liam.torres@example.com",
    memberEmails: ["carlos.mendez@example.com", "alex.rivera@example.com"],
  },
  {
    name: "SLO Sound",
    description:
      "Practice space sharers and impromptu jam session organizers. DMs open if you play anything — we figure out the rest.",
    city: "San Luis Obispo",
    joinType: "REQUEST",
    interests: ["Guitar", "Piano", "Concerts", "Singing"],
    ownerEmail: "tyler.kim@example.com",
    memberEmails: [
      "jake.morrow@example.com",
      "jasmine.moore@example.com",
      "maya.singh@example.com",
    ],
  },
  {
    name: "Sunday Brunch Club",
    description:
      "We rotate hosting brunch every other Sunday. Someone cooks, everyone brings something. More eating club than cooking club, honestly.",
    city: "San Luis Obispo",
    joinType: "OPEN",
    interests: ["Cooking", "Baking", "Coffee"],
    ownerEmail: "sofia.chen@example.com",
    memberEmails: [
      "lily.tran@example.com",
      "emma.walsh@example.com",
      "natalie.cruz@example.com",
    ],
  },
  {
    name: "Tri-County Makers",
    description:
      "Robotics, 3D printing, embedded systems, and the occasional game jam. We share tools, space, and debugging pain.",
    city: "Atascadero",
    joinType: "OPEN",
    interests: ["Robotics", "Coding", "Design"],
    ownerEmail: "brendan.cole@example.com",
    memberEmails: ["ryan.hughes@example.com", "liam.torres@example.com"],
  },
  {
    name: "Central Coast Photo Walk",
    description:
      "Bi-weekly photo walks around SLO, Morro Bay, and the coast. All cameras welcome — phone shooters too.",
    city: "San Luis Obispo",
    joinType: "OPEN",
    interests: ["Photography", "Hiking", "Film"],
    ownerEmail: "priya.nair@example.com",
    memberEmails: [
      "zoe.abbott@example.com",
      "maya.singh@example.com",
      "hannah.beck@example.com",
    ],
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // 1. Seed interests
  for (const interest of interestData) {
    await db.interest.upsert({
      where: { name: interest.name },
      create: interest,
      update: {},
    });
  }
  console.log(`✓ ${interestData.length} interests`);

  // 2. Interest lookup map
  const allInterests = await db.interest.findMany();
  const interestByName = new Map(allInterests.map((i) => [i.name, i.id]));

  function iid(name: string): string {
    const id = interestByName.get(name);
    if (!id) throw new Error(`Unknown interest: "${name}"`);
    return id;
  }

  // 3. Seed users
  const userIdByEmail = new Map<string, string>();

  for (const u of userData) {
    const user = await db.user.upsert({
      where: { email: u.email },
      create: { email: u.email, name: u.name, bio: u.bio, city: u.city, onboarded: true },
      update: { name: u.name, bio: u.bio, city: u.city, onboarded: true },
    });

    userIdByEmail.set(u.email, user.id);

    await db.userInterest.deleteMany({ where: { userId: user.id } });
    await db.userInterest.createMany({
      data: u.interests.map((name) => ({ userId: user.id, interestId: iid(name) })),
    });

    await db.availability.deleteMany({ where: { userId: user.id } });
    await db.availability.createMany({
      data: u.availability.map((a) => ({ userId: user.id, day: a.day, slot: a.slot })),
    });
  }

  console.log(`✓ ${userData.length} users`);

  // 4. Seed groups
  for (const g of groupData) {
    const ownerId = userIdByEmail.get(g.ownerEmail);
    if (!ownerId) throw new Error(`Owner not found: ${g.ownerEmail}`);

    const existing = await db.group.findFirst({ where: { name: g.name } });

    let group;
    if (existing) {
      group = await db.group.update({
        where: { id: existing.id },
        data: { description: g.description, city: g.city, joinType: g.joinType },
      });
    } else {
      group = await db.group.create({
        data: { name: g.name, description: g.description, city: g.city, joinType: g.joinType },
      });
    }

    await db.groupMember.deleteMany({ where: { groupId: group.id } });
    await db.groupInterest.deleteMany({ where: { groupId: group.id } });

    await db.groupMember.create({
      data: { groupId: group.id, userId: ownerId, role: "OWNER" },
    });

    for (const email of g.memberEmails) {
      const memberId = userIdByEmail.get(email);
      if (!memberId) continue;
      await db.groupMember.upsert({
        where: { userId_groupId: { userId: memberId, groupId: group.id } },
        create: { groupId: group.id, userId: memberId, role: "MEMBER" },
        update: {},
      });
    }

    await db.groupInterest.createMany({
      data: g.interests.map((name) => ({ groupId: group.id, interestId: iid(name) })),
    });
  }

  console.log(`✓ ${groupData.length} groups`);

  // 5. Pre-seed a pending like so the demo match fires immediately
  //    SLO Film Club has already liked Central Coast Photo Walk.
  //    Join Central Coast Photo Walk, then swipe LIKE on SLO Film Club → instant match.
  const filmClub = await db.group.findFirst({ where: { name: "SLO Film Club" } });
  const photoWalk = await db.group.findFirst({ where: { name: "Central Coast Photo Walk" } });
  const coders = await db.group.findFirst({ where: { name: "Central Coast Coders" } });
  if (filmClub && photoWalk) {
    await db.groupSwipe.upsert({
      where: { fromGroupId_toGroupId: { fromGroupId: filmClub.id, toGroupId: photoWalk.id } },
      create: { fromGroupId: filmClub.id, toGroupId: photoWalk.id, direction: "LIKE" },
      update: {},
    });
    console.log("✓ pre-seeded swipe: SLO Film Club → Central Coast Photo Walk (LIKE)");
  }
  if (coders && photoWalk) {
    await db.groupSwipe.upsert({
      where: { fromGroupId_toGroupId: { fromGroupId: coders.id, toGroupId: photoWalk.id } },
      create: { fromGroupId: coders.id, toGroupId: photoWalk.id, direction: "LIKE" },
      update: {},
    });
    console.log("✓ pre-seeded swipe: Central Coast Coders → Central Coast Photo Walk (LIKE)");
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
