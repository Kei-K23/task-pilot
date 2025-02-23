import type { Metadata } from "next";
import "./globals.css";
import QueryProviders from "@/components/provider/query-provider";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/provider/theme-provider";

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
      <body className={`antialiased`} suppressHydrationWarning>
        <QueryProviders>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="task_pilot_theme_key"
            >
              {children}
            </ThemeProvider>
          </NuqsAdapter>
          <Toaster />
        </QueryProviders>
      </body>
    </html>
  );
}
