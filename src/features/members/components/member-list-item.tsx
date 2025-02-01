import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Gavel, LogOut, MoreHorizontal, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MemberAvatar from "./member-avatar";
import type { Member } from "../type";
import { MEMBER_ROLE } from "@/features/workspaces/type";
import { Skeleton } from "@/components/ui/skeleton";

interface MemberListItemProps {
  member: Member;
  currentMember?: Member | null;
  isMutationLoading: boolean;
  setOpenRoleUpdateDialog: (openRoleUpdateDialog: boolean) => void;
  setSelectedMember: (selectedMember: Member) => void;
  onDeleteMember: (memberId: string) => void;
}

export default function MemberListItem({
  member,
  currentMember,
  isMutationLoading,
  onDeleteMember,
  setOpenRoleUpdateDialog,
  setSelectedMember,
}: MemberListItemProps) {
  const renderDropdownMenu = (member: Member) => {
    if (!currentMember) return null;

    const isAdmin = currentMember.role === MEMBER_ROLE.ADMIN;
    const isCurrentUser = currentMember.$id === member.$id;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={isMutationLoading} variant={"outline"} size={"sm"}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <User />
            View Profile
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => {
                setSelectedMember(member);
                setOpenRoleUpdateDialog(true);
              }}
            >
              <Shield /> Role
            </DropdownMenuItem>
          )}
          {!isAdmin && isCurrentUser && (
            <DropdownMenuItem
              className="bg-red-500 text-white focus:bg-red-600/90 focus:text-white/90"
              onClick={() => onDeleteMember(member.$id)}
            >
              <LogOut /> Leave
            </DropdownMenuItem>
          )}
          {isAdmin && !isCurrentUser && member.role !== MEMBER_ROLE.ADMIN && (
            <DropdownMenuItem
              className="bg-red-500 text-white focus:bg-red-600/90 focus:text-white/90"
              onClick={() => onDeleteMember(member.$id)}
            >
              <Gavel /> Kick
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div
      key={member.$id}
      className="border-b pb-4 last:border-b-0 last:pb-0 flex items-center justify-between"
    >
      <div className="flex items-start gap-x-2">
        <MemberAvatar name={member.name} color={member.color} />
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <span>{member.name}</span>
            <Badge
              variant={
                member.role === MEMBER_ROLE.ADMIN ? "destructive" : "default"
              }
              className="px-2 py-[1px] text-[8px]"
            >
              {member.role}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">{member.email}</span>
        </div>
      </div>
      {renderDropdownMenu(member)}
    </div>
  );
}

export const MemberListItemSkeleton = () => (
  <div className="w-full h-[60px] border-b pb-4 last:border-b-0 last:pb-0 flex gap-x-2 justify-between">
    <div className="flex gap-x-2">
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="w-[100px] h-4" />
        <Skeleton className="w-[140px] h-4" />
      </div>
    </div>
    <Skeleton className="size-10" />
  </div>
);
