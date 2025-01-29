import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MemberAvatarProps {
  name: string;
  img?: string;
  color: string;
}

export default function MemberAvatar({ name, img, color }: MemberAvatarProps) {
  return (
    <Avatar className="size-12 border border-neutral-300 transition-all hover:opacity-75 cursor-pointer">
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
