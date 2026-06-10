import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white">
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
