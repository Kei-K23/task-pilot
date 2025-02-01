import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProjectAvatarProps {
  imageUrl?: string;
  name: string;
}

export default function ProjectAvatar({ imageUrl, name }: ProjectAvatarProps) {
  return (
    <div className="flex items-center gap-x-2">
      <Avatar className="size-12 rounded-lg">
        <AvatarImage src={imageUrl} alt="Project logo" />
        <AvatarFallback className="bg-black text-white rounded-lg font-bold text-lg">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-lg font-bold">{name}</span>
    </div>
  );
}
