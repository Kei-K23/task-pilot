import { getCurrent } from "@/features/auth/queries";
import { getWorkspaceForMemberById } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";
import WorkspaceIdSettingClientPage from "./client";

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

  const workspace = await getWorkspaceForMemberById(workspaceId);
  if (!workspace) {
    return redirect(`/workspaces/${workspaceId}`);
  }

  return <WorkspaceIdSettingClientPage />;
}
