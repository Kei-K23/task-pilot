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

interface DeleteProjectSectionProps {
  projectId: string;
}

export default function DeleteProjectSection({
  projectId,
}: DeleteProjectSectionProps) {
  const router = useRouter();
  // const { mutate } = useDeletePro();
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
      <Card className="mt-4 border-red-300 bg-red-200/30">
        <CardHeader>
          <CardTitle className="text-lg">Danger Zone</CardTitle>
          <CardDescription className="text-primary text-base">
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
