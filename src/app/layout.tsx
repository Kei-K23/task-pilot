import type { Metadata } from "next";
import "./globals.css";
import QueryProviders from "@/components/provider/query-provider";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "TaskPilot",
  description:
    "Manage, gather and navigate your tasks and projects like a pro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <QueryProviders>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
        </QueryProviders>
      </body>
    </html>
  );
}
