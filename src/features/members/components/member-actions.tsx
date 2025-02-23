import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Gavel, LogOut, MoreHorizontal, Shield, User } from "lucide-react";
import { Member } from "../type";
import { MEMBER_ROLE } from "@/features/workspaces/type";
import Link from "next/link";

interface MemberActionsProps {
  member: Member;
  isAdmin: boolean;
  isCurrentUser: boolean;
  isMutationLoading: boolean;
  workspaceId: string;
  setOpenRoleUpdateDialog: (openRoleUpdateDialog: boolean) => void;
  setSelectedMember: (selectedMember: Member) => void;
  onDeleteMember: (memberId: string) => void;
}

export default function MemberActions({
  member,
  isAdmin,
  isMutationLoading,
  isCurrentUser,
  workspaceId,
  setOpenRoleUpdateDialog,
  setSelectedMember,
  onDeleteMember,
}: MemberActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isMutationLoading} variant={"outline"} size={"sm"}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href={`/workspaces/${workspaceId}/members/${member.$id}`}>
          <DropdownMenuItem className="cursor-pointer">
            <User />
            View Profile
          </DropdownMenuItem>
        </Link>
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
}
