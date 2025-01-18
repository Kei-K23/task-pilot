import { getCurrent } from "@/features/auth/queries";
import EditWorkspacesForm from "@/features/workspaces/components/edit-workspaces-form";
import { getWorkspaceById } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkspaceIdSettingPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceIdSettingPage({
  params,
}: WorkspaceIdSettingPageProps) {
  const workspaceId = (await params).workspaceId;

  const user = await getCurrent();
  if (!user) {
    return redirect("/sign-in");
  }

  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace) {
    return redirect(`/workspaces/${workspaceId}`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <EditWorkspacesForm initialValue={workspace} />
    </div>
  );
}
