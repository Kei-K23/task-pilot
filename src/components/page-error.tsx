"use client";
import { AlertTriangle } from "lucide-react";
import React from "react";

interface PageErrorProps {
  message?: string;
}

export default function PageError({
  message = "Something went wrong",
}: PageErrorProps) {
  return (
    <div className="flex h-full items-center justify-center flex-col">
      <AlertTriangle className="size-6 text-muted-foreground text-red-500" />
      <span className="text-muted-foreground">{message}</span>
    </div>
  );
}
