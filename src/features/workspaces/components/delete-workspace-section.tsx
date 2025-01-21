import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export default function DeleteWorkspaceSection() {
  return (
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
          <Button variant={"destructive"}>
            <Trash2 /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
