import { getCurrent } from "@/features/auth/queries";
import DeleteWorkspaceSection from "@/features/workspaces/components/delete-workspace-section";
import EditWorkspacesForm from "@/features/workspaces/components/edit-workspaces-form";
import WorkspaceInvitationSection from "@/features/workspaces/components/workspace-invitation-section";
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
    <div className="w-full mx-auto space-y-6">
      <EditWorkspacesForm initialValue={workspace} />
      <WorkspaceInvitationSection
        workspaceId={workspace.$id}
        inviteCode={workspace.inviteCode}
      />
      <DeleteWorkspaceSection workspaceId={workspace.$id} />
    </div>
  );
}
