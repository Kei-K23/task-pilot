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
import { Member } from "../type";
import { MEMBER_ROLE } from "@/features/workspaces/type";
import { useMemo } from "react";
import { useDeleteMember } from "../api/use-delete-member";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import useConfirmDialog from "@/hooks/use-confirm-dialog";

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
  const [DeleteConfirmDialog, deleteConfirm] = useConfirmDialog(
    "Are you sure?",
    "This process cannot be undo and permanently delete all member's data for this workspace."
  );
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: deleteMember, isPending: deleteMemberLoading } =
    useDeleteMember();

  const isMutationLoading = useMemo(() => {
    return deleteMemberLoading;
  }, [deleteMemberLoading]);

  const handleDeleteMember = async (memberId: string) => {
    const isOk = await deleteConfirm();
    if (!isOk) {
      return;
    }

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

          if (currentMember?.$id === memberId) {
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            queryClient.removeQueries({ queryKey: ["members"] });
            router.push("/");
          }
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
      <>
        <DeleteConfirmDialog />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={isMutationLoading}
              variant={"outline"}
              size={"sm"}
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User />
              View Profile
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem>
                <Shield /> Role
              </DropdownMenuItem>
            )}
            {!isAdmin && isCurrentUser && (
              <DropdownMenuItem
                className="bg-red-500 text-white focus:bg-red-600/90 focus:text-white/90"
                onClick={() => handleDeleteMember(member.$id)}
              >
                <LogOut /> Leave
              </DropdownMenuItem>
            )}
            {isAdmin && !isCurrentUser && (
              <DropdownMenuItem
                className="bg-red-500 text-white focus:bg-red-600/90 focus:text-white/90"
                onClick={() => handleDeleteMember(member.$id)}
              >
                <Gavel /> Kick
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </>
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
