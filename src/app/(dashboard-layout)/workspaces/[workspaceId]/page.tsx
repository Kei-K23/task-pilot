import React from "react";

interface WorkspaceIdPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspaceIdPage({
  params,
}: WorkspaceIdPageProps) {
  const { workspaceId } = await params;
  return <div>workspaceId : {workspaceId}</div>;
}
