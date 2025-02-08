import { cn } from "@/lib/utils";
import React from "react";

interface DotdotSeparatorProps {
  className?: string;
}

export default function DotdotSeparator({ className }: DotdotSeparatorProps) {
  return (
    <div
      className={cn(
        "w-full border-t-2 border-dotted border-neutral-300",
        className
      )}
    />
  );
}
