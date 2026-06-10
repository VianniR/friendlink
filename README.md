# FriendLink

A mobile-first web app for group-to-group friend finding. Users create or join 
groups, swipe on other groups in a discovery feed, and chat with groups they 
match with.

Built for CSC 492 Senior Project at Cal Poly.

## Stack

- Next.js 16 (App Router)
- Prisma + SQLite
- NextAuth v4 with Google OAuth
- Tailwind CSS v4
- Framer Motion v12

## Getting Started

### Prerequisites
- Node.js 18+
- A Google OAuth app (for authentication)

### Setup

1. Clone the repo and install dependencies:
```bash
   npm install
```

2. Create a `.env.local` file with your credentials:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

3. Set up the database:
```bash
   npx prisma migrate dev
   npx prisma db seed
```

4. Run the development server:
```bash
   npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.