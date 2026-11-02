
# FriendLink

**A group-to-group social discovery platform for making new friends.**

FriendLink is a mobile-first web application that helps existing friend groups discover and connect with other compatible groups. Instead of matching individuals, FriendLink allows groups to discover each other through a swipe-based interface, form mutual matches, and coordinate meetups through shared conversations.

Built as an individual senior project at California Polytechnic State University, San Luis Obispo.

**Tech Stack:** Next.js 16 · TypeScript · Prisma 6 · SQLite · NextAuth · Tailwind CSS · Framer Motion

## Overview

Most social discovery platforms focus on individual connections or organized events. FriendLink explores a different approach: making new friends alongside people you already know.

Users create or join friend groups, discover other groups ranked by compatibility, and swipe to express interest. When two groups mutually like each other, a match is created and members gain access to a shared chat.

The application was designed around three goals:

- Make meeting new people less intimidating through group-based interactions.
- Recommend compatible groups based on shared interests, availability, and location.
- Provide a complete experience from onboarding through discovery, matching, and messaging.

## Features

### Authentication and Onboarding

- Google OAuth authentication with persistent sessions
- Four-step onboarding for profile information, interests, availability, and city
- Selection from 30 predefined interests across multiple categories
- Weekly availability selection using a 7-day, 3-time-slot grid
- Protected routes requiring authentication and completed onboarding

### Group Management

- Create groups with descriptions, interests, and locations
- Join open groups immediately or request membership in restricted groups
- Owner and member roles with membership approval controls
- Browse available groups separately from group-to-group discovery

### Discovery and Matching

- Swipeable group cards with gesture-based animations
- Compatibility-based ranking of candidate groups
- Detailed group profiles accessible directly from discovery cards
- Mutual-like detection and match confirmation
- Filtering of previously swiped groups

### Messaging and Safety

- Shared conversations between mutually matched groups
- Message polling every four seconds
- Membership-based authorization for chat access
- User blocking and reporting functionality
- City-level location information rather than precise coordinates

## Matching Algorithm

FriendLink implements a content-based recommendation algorithm that ranks groups using three weighted compatibility factors.

### Compatibility Score

$$
S = 0.40I + 0.35A + 0.25C
$$

Where:

- **I:** Interest similarity
- **A:** Schedule availability overlap
- **C:** City proximity

| Component | Weight | Method |
|---|---|---|
| Interest Similarity | 40% | Jaccard similarity between group interest sets |
| Schedule Overlap | 35% | Overlap between members' aggregated availability |
| City Proximity | 25% | Binary comparison of group cities |

### Interest Similarity

Jaccard similarity measures the intersection of two groups' interests relative to their union:

$$
J(A,B) = \frac{|A \cap B|}{|A \cup B|}
$$

This produces a score between 0 and 1 without requiring historical interaction data.

### Schedule Overlap

Each group's availability is formed by combining its members' available day/time slots. The matching algorithm compares these sets to reward groups with compatible schedules.

### City Proximity

Groups in the same city receive a proximity score of 1, while groups in different cities receive 0.

Candidates that have already been swiped on are excluded before ranking.

The algorithm emphasizes shared interests while accounting for the practical constraints of coordinating group activities.

## Technical Architecture

FriendLink uses Next.js 16 with the App Router, separating server-side data operations from interactive client components.

### Frontend

- React and TypeScript
- Tailwind CSS v4 for responsive styling
- Framer Motion v12 for drag gestures and animations
- Mobile-first layout constrained to a 448px viewport

### Backend

- Next.js Server Components for data fetching and authorization
- Server Actions for database mutations
- Dedicated GET endpoint for chat polling
- NextAuth v4 for Google OAuth authentication

### Database

- Prisma 6 ORM
- SQLite persistence
- Relational models for users, groups, interests, availability, swipes, matches, messages, and safety features
- Transactions for coordinated profile updates

### Data Model

The application uses 13 Prisma models covering authentication, group relationships, and safety functionality.

Important relationships include:

- **User → GroupMember → Group:** Supports group membership and role management.
- **Group → GroupSwipe → GroupMatch:** Records directed swipes and creates mutual matches.
- **GroupMatch → Message:** Associates group conversations with successful matches.
- **User → Availability / Interest:** Supplies attributes used by the compatibility algorithm.

### Authentication and Authorization

Authenticated routes are protected using Next.js layouts, with users redirected to sign-in or onboarding when necessary.

Chat access is authorized by checking whether a user belongs to either participating group in the match.

## Design Iteration and User Testing

FriendLink was tested through demonstrations with friends, classmates, and family members. Participants exercised the primary flow: authentication, onboarding, group creation or joining, discovery, matching, and messaging.

Two significant improvements resulted from this feedback:

### 1. Expanded Group Details

Early testers wanted more context before deciding whether to like or pass on a group.

A detailed group profile view was added so users could inspect descriptions, interests, and members without leaving the discovery interface.

### 2. Clearer Separation of Group Management and Discovery

Testing revealed confusion between joining an existing group and matching with another group.

The interface was refined so the Groups page handles membership while the Discover page focuses on group-to-group matching.

These iterations reinforced the importance of validating product decisions with users rather than relying exclusively on technical implementation.

## Getting Started

### Prerequisites

- Node.js version compatible with Next.js 16
- npm
- Google OAuth credentials

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/VianniR/friendlink.git
   cd friendlink
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file containing:

   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

4. Initialize the database:

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Visit `http://localhost:3000`.

## Limitations and Future Improvements

FriendLink was developed and tested primarily as a local application rather than a publicly deployed service.

Areas for future development include:

- Geographic proximity ranking beyond same-city matching
- Real-time messaging using WebSockets or a similar solution
- Read receipts and notifications
- An administrative dashboard for reviewing reports
- Custom group photo uploads
- Improvements to the cold-start experience for locations with few active groups

## Project Background

FriendLink was developed as an individual senior project over two academic quarters at Cal Poly under the guidance of advisor Dev Sisodia.

The project involved end-to-end ownership of application architecture, database modeling, authentication, frontend development, recommendation logic, and user testing.

The central challenge was not simply implementing a social application, but designing a group-oriented interaction model and translating it into a functional product.

**Author:** Vianni Richards  
**Institution:** California Polytechnic State University, San Luis Obispo  
**Completed:** June 2026
