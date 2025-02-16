"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full items-center justify-center flex-col">
      <div className="flex items-center gap-x-2 mb-3">
        <AlertTriangle className="size-6 text-red-500 text-muted-foreground" />
        <span className="font-bold text-xl">Something went wrong!</span>
      </div>
      <p className="text-muted-foreground text-lg">
        We could not load the resource
      </p>
      <div className="flex items-center justify-center gap-x-4">
        <Link href="/">
          <Button variant={"outline"} className="mt-1">
            Return Home
          </Button>
        </Link>
        <Button onClick={() => reset()} variant={"outline"} className="mt-1">
          Try again
        </Button>
      </div>
    </div>
  );
}
