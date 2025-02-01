import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateMemberRole } from "../api/use-update-member-role";
import { toast } from "sonner";
import { Member } from "../type";
import { MEMBER_ROLE } from "@/features/workspaces/type";

interface UpdateRoleDialogProps {
  open: boolean;
  member: Member | null;
  workspaceId: string;
  setSelectedMember: (selectedMember: Member | null) => void;
  setOpen: (open: boolean) => void;
}

export default function UpdateRoleDialog({
  open,
  member,
  workspaceId,
  setSelectedMember,
  setOpen,
}: UpdateRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState(member?.role);
  const { mutate: updateRole, isPending } = useUpdateMemberRole(workspaceId);

  const handleUpdateRole = () => {
    if (!member || !selectedRole) {
      return;
    }
    if (selectedRole === member?.role) {
      setOpen(false);
      return;
    }

    updateRole(
      {
        param: {
          memberId: member.$id,
        },
        query: {
          workspaceId,
        },
        json: {
          role: selectedRole,
        },
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          setOpen(false);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setSelectedMember(null);
        setOpen(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update role for &apos;{member?.name}&apos;</DialogTitle>
          <DialogDescription>
            Please be careful before change the Member role
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Select
            defaultValue={member?.role}
            value={selectedRole}
            onValueChange={(value: MEMBER_ROLE) => setSelectedRole(value)}
          >
            <SelectTrigger id="role-select">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateRole} disabled={isPending}>
            {isPending ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
