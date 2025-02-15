import UserButton from "@/features/auth/components/user-button";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="pb-10">
      <nav className="max-w-5xl mx-auto">
        <div className="px-4 flex items-center justify-between gap-x-4 py-4">
          <Link href={"/"} className="flex items-center gap-x-2">
            <RefreshCcw />
            TaskPilot
          </Link>

          <UserButton />
        </div>
      </nav>
      <div className="px-4">{children}</div>
    </main>
  );
}
