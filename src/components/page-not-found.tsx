"use client";
import { SearchX } from "lucide-react";
import React from "react";

interface PageNotFoundProps {
  message?: string;
}

export default function PageNotFound({
  message = "The resource you are trying to find is not found",
}: PageNotFoundProps) {
  return (
    <div className="flex h-full items-center justify-center flex-col">
      <div className="flex items-center gap-x-1">
        <SearchX className="size-6 text-muted-foreground" />
        <span className="text-lg font-bold">Not Found</span>
      </div>
      <span className="text-muted-foreground">{message}</span>
    </div>
  );
}
