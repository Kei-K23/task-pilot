"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useDeleteWorkspace } from "../api/use-delete-workspaces";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteWorkspaceSectionProps {
  workspaceId: string;
}

export default function DeleteWorkspaceSection({
  workspaceId,
}: DeleteWorkspaceSectionProps) {
  const router = useRouter();
  const { mutate } = useDeleteWorkspace();
  const [DeleteConfirmDialog, confirm] = useConfirmDialog(
    "Are you sure?",
    "This process cannot be undo."
  );

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    }

    mutate(
      {
        param: {
          workspaceId,
        },
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          router.push("/");
        },
        onError: (data) => {
          toast.success(data.message);
        },
      }
    );
  };

  return (
    <>
      <DeleteConfirmDialog />
      <Card className="mt-4 dark:border-red-500 dark:bg-red-400/30 border-red-300 bg-red-200/30">
        <CardHeader>
          <CardTitle className="text-lg">Danger Zone</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Deleting a workspace is irreversible and will remove every related
            data with the workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <Button onClick={handleDelete} variant={"destructive"}>
              <Trash2 /> Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
