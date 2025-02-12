import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";
import React from "react";

interface TaskDateProps {
  dueDate: string;
  className?: string;
}

export default function TaskDate({ dueDate, className }: TaskDateProps) {
  const now = new Date();
  const end = new Date(dueDate);
  const dateBetween = differenceInDays(end, now);

  let textColor = "text-muted-foreground font-bold";

  if (dateBetween <= 3) {
    textColor += " text-red-500";
  } else if (dateBetween <= 7) {
    textColor += " text-orange-500";
  } else if (dateBetween <= 14) {
    textColor += " text-yellow-600";
  }

  return (
    <div className={cn(textColor, className)}>{format(dueDate, "PPP")}</div>
  );
}
