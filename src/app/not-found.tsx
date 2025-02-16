"use client";

import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NotFoundPage() {
  return (
    <div className="flex h-full items-center justify-center flex-col">
      <div className="flex items-center gap-x-2 mb-3">
        <Frown className="size-6 text-muted-foreground" />
        <span className="font-bold text-xl">Not Found</span>
      </div>
      <p className="text-muted-foreground text-lg">
        Could not find requested resource
      </p>
      <Link href="/">
        <Button variant={"outline"} className="mt-1">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
