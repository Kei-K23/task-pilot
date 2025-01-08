import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";
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
  const user = await getCurrent();

  if (!user) {
    return redirect("/sign-in");
  }

  return <div>workspaceId : {workspaceId}</div>;
}
