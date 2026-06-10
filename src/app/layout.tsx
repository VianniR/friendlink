import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "FriendLink",
  description: "Find your people — one swipe at a time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
