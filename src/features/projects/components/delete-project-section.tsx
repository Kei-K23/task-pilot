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
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDeleteProject } from "../api/use-delete-project";
import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";

interface DeleteProjectSectionProps {
  projectId: string;
}

export default function DeleteProjectSection({
  projectId,
}: DeleteProjectSectionProps) {
  const workspaceId = useGetWorkspaceParam();
  const router = useRouter();
  const { mutate, isPending } = useDeleteProject({ workspaceId });
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
          projectId,
        },
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          router.push(`/workspaces/${workspaceId}`);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      }
    );
  };

  return (
    <>
      <DeleteConfirmDialog />
      <Card className="mt-4 border-red-300 bg-red-200/30">
        <CardHeader>
          <CardTitle className="text-lg">Danger Zone</CardTitle>
          <CardDescription className="text-primary text-base">
            Deleting a project is irreversible and will remove every related
            data with the project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <Button
              disabled={isPending}
              onClick={handleDelete}
              variant={"destructive"}
            >
              {isPending ? (
                "Deleting..."
              ) : (
                <>
                  <Trash2 /> Delete
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
