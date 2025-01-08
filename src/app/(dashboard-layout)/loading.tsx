import { Loader } from "lucide-react";

export default function DashboardLoader() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader className="size-7 animate-spin text-muted-foreground" />
    </div>
  );
}
