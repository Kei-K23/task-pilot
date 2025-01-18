import { getCurrent } from "@/features/auth/actions";
import CreateWorkspacesForm from "@/features/workspaces/components/create-workspaces-form";
import { redirect } from "next/navigation";

export default async function WorkspaceCreatePage() {
  const user = await getCurrent();
  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <CreateWorkspacesForm />
    </div>
  );
}
