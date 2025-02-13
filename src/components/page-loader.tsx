"use client";

import { Loader2 } from "lucide-react";
import React from "react";

export default function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center flex-col">
      <Loader2 className="size-6 text-muted-foreground animate-spin" />
    </div>
  );
}
