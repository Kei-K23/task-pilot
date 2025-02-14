import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import React from "react";
import WorkspaceIdClientPage from "./client";

export default async function WorkspaceIdPage() {
  const user = await getCurrent();

  if (!user) {
    return redirect("/sign-in");
  }

  return <WorkspaceIdClientPage />;
}
