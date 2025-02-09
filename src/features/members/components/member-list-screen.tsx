"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMembers } from "../api/use-get-members";
import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import { useGetCurrentMember } from "../api/use-get-current-member";
import { useMemo, useState } from "react";
import MemberListItem, { MemberListItemSkeleton } from "./member-list-item";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { useDeleteMember } from "../api/use-delete-member";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import UpdateRoleDialog from "./update-role-dialog";
import { Member } from "../type";

export default function MemberListScreen() {
  const [openRoleUpdateDialog, setOpenRoleUpdateDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const workspaceId = useGetWorkspaceParam();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [DeleteConfirmDialog, deleteConfirm] = useConfirmDialog(
    "Are you sure?",
    "This process cannot be undone and will permanently delete all member's data for this workspace."
  );

  const { data: currentMember, isLoading: currentMemberLoading } =
    useGetCurrentMember(workspaceId);
  const { data: membersList, isLoading: memberListLoading } = useGetMembers({
    workspaceId,
  });
  const { mutate: deleteMember, isPending: deleteMemberLoading } =
    useDeleteMember();

  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const isLoading = useMemo(() => {
    return currentMemberLoading || memberListLoading;
  }, [currentMemberLoading, memberListLoading]);

  const handleDeleteMember = async (memberId: string) => {
    setMemberToDelete(memberId);
    const isOk = await deleteConfirm();
    if (!isOk) {
      setMemberToDelete(null);
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

          if (currentMember?.data?.$id === memberId) {
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            queryClient.invalidateQueries({
              queryKey: ["members", workspaceId],
            });
            router.push("/");
          }
        },
        onError: ({ message }) => {
          toast.error(message);
        },
        onSettled: () => {
          setMemberToDelete(null);
        },
      }
    );
  };

  return (
    <>
      <UpdateRoleDialog
        open={openRoleUpdateDialog}
        setOpen={setOpenRoleUpdateDialog}
        setSelectedMember={setSelectedMember}
        member={selectedMember}
        workspaceId={workspaceId}
      />
      <DeleteConfirmDialog />
      <Card className="mt-4">
        <CardHeader className="flex items-center flex-row gap-x-4">
          <CardTitle className="text-lg text-center">Member List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {isLoading
              ? [1, 2, 3].map((i) => <MemberListItemSkeleton key={i} />)
              : membersList?.data?.map((member) => (
                  <MemberListItem
                    setOpenRoleUpdateDialog={setOpenRoleUpdateDialog}
                    setSelectedMember={setSelectedMember}
                    key={member.$id}
                    member={member}
                    currentMember={currentMember?.data}
                    onDeleteMember={handleDeleteMember}
                    isMutationLoading={
                      deleteMemberLoading && memberToDelete === member.$id
                    }
                  />
                ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
