"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import DeleteWorkspaceSection from "@/features/workspaces/components/delete-workspace-section";
import EditWorkspacesForm from "@/features/workspaces/components/edit-workspaces-form";
import { useGetWorkspaceIdParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import dynamic from "next/dynamic";

const WorkspaceInvitationSection = dynamic(
  () => import("@/features/workspaces/components/workspace-invitation-section"),
  {
    ssr: false,
  }
);

export default function WorkspaceIdSettingClientPage() {
  const workspaceId = useGetWorkspaceIdParam();
  const { data, isLoading, error } = useGetWorkspaceById({ workspaceId });

  if (isLoading) {
    return <PageLoader />;
  }

  if ((!isLoading && !data) || (!isLoading && error !== null)) {
    return <PageError />;
  }

  if (!data) {
    return <PageError />;
  }

  return (
    <div>
      <h2 className="mb-5 text-2xl font-semibold">Settings</h2>
      <div className="w-full mx-auto space-y-6">
        <EditWorkspacesForm initialValue={data} />
        <WorkspaceInvitationSection
          workspaceId={data.$id}
          inviteCode={data.inviteCode}
        />
        <DeleteWorkspaceSection workspaceId={data.$id} />
      </div>
    </div>
  );
}
