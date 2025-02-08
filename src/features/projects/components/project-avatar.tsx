import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProjectAvatarProps {
  imageUrl?: string;
  name: string;
  className?: string;
  showName?: boolean;
}

export default function ProjectAvatar({
  imageUrl,
  name,
  className,
  showName = true,
}: ProjectAvatarProps) {
  return (
    <div className="flex items-center gap-x-2">
      <Avatar className={cn("size-12 rounded-lg", className)}>
        <AvatarImage src={imageUrl} alt="Project logo" />
        <AvatarFallback className="bg-black text-white rounded-lg font-bold text-lg">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {showName && <span className="text-lg font-bold">{name}</span>}
    </div>
  );
}
