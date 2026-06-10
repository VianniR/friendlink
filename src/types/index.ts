export type InterestData = {
  id: string;
  name: string;
  category: string;
};

export type AvailabilitySlot = {
  day: number;
  slot: string;
};

export type UserCardData = {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  city: string | null;
  interests: { interest: { name: string; category: string } }[];
};

export type GroupCardData = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  city: string | null;
  interests: { interest: { name: string; category: string } }[];
  members: { user: { name: string | null; image: string | null } }[];
};
