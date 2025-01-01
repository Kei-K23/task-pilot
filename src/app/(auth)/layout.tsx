import Navbar from "@/features/auth/components/navbar";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="pb-10">
      <Navbar />
      <div className="px-4">{children}</div>
    </main>
  );
}
