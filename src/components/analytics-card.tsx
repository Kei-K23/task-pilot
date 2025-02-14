import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  label: string;
  value: number;
  variant: "up" | "down";
  increaseValue: number;
}

export default function AnalyticsCard({
  label,
  value,
  variant,
  increaseValue,
}: AnalyticsCardProps) {
  const variantColor = variant === "up" ? "text-emerald-500" : "text-red-500";
  const VariantIcon = variant === "up" ? TrendingUp : TrendingDown;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-x-8">
          <span className="text-muted-foreground">{label}</span>
          <div className="flex items-center gap-x-2">
            <VariantIcon className={cn(variantColor, "size-5")} />
            <span className="text-muted-foreground">{increaseValue}</span>
          </div>
        </CardTitle>
        <CardDescription className="text-xl font-bold text-black dark:text-white">
          {value}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
