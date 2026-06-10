import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          onboarded: (user as { onboarded: boolean }).onboarded ?? false,
        },
      };
    },
  },
  pages: {
    signIn: "/signin",
  },
};

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  return session;
}

export async function requireOnboarded() {
  const session = await requireAuth();
  if (!session.user.onboarded) redirect("/onboarding");
  return session;
}
