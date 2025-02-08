import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MemberAvatarProps {
  name: string;
  img?: string;
  color: string;
  className?: string;
}

export default function MemberAvatar({
  name,
  img,
  color,
  className,
}: MemberAvatarProps) {
  return (
    <Avatar
      className={cn(
        "size-12 border border-neutral-300 transition-all hover:opacity-75 cursor-pointer",
        className
      )}
    >
      <AvatarImage src={img} alt={name} />
      <AvatarFallback
        style={{
          backgroundColor: color,
        }}
        className="font-bold text-lg"
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
