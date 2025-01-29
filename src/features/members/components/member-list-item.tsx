import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MemberAvatar from "./member-avatar";
import { Member } from "../type";
import { MEMBER_ROLE } from "@/features/workspaces/type";
import { useMemo } from "react";
import { useDeleteMember } from "../api/use-delete-member";
import { toast } from "sonner";

interface MemberListItemProps {
  member: Member;
  currentMember?: Member | null;
  workspaceId: string;
}

export default function MemberListItem({
  member,
  currentMember,
  workspaceId,
}: MemberListItemProps) {
  const { mutate: deleteMember, isPending: deleteMemberLoading } =
    useDeleteMember();

  const isMutationLoading = useMemo(() => {
    return deleteMemberLoading;
  }, [deleteMemberLoading]);

  const handleDeleteMember = (memberId: string) => {
    deleteMember(
      {
        param: {
          memberId,
        },
        query: {
          workspaceId,
        },
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      }
    );
  };

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
          {isAdmin && <DropdownMenuItem>Role</DropdownMenuItem>}
          {!isAdmin && isCurrentUser && (
            <DropdownMenuItem onClick={() => handleDeleteMember(member.$id)}>
              Leave
            </DropdownMenuItem>
          )}
          {isAdmin && !isCurrentUser && (
            <DropdownMenuItem onClick={() => handleDeleteMember(member.$id)}>
              Kick
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
