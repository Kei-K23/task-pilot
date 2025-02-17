import PageNotFound from "@/components/page-not-found";
import WorkspaceJoinScreen from "@/features/workspaces/components/workspace-join-screen";
import { getWorkspaceById } from "@/features/workspaces/queries";

interface WorkspaceJoinPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceJoinPage({
  params,
}: WorkspaceJoinPageProps) {
  const workspaceId = (await params).workspaceId;
  const workspace = await getWorkspaceById(workspaceId);

  if (!workspace) {
    return <PageNotFound />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <WorkspaceJoinScreen
        workspaceName={workspace?.name}
        workspaceId={workspace.$id}
      />
    </div>
  );
}
