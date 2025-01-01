import Navbar from "@/features/auth/components/navbar";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-neutral-100 h-full">
      <Navbar />
      {children}
    </main>
  );
}
