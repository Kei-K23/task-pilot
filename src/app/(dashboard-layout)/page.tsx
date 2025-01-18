import { getCurrent } from "@/features/auth/actions";
import { getWorkspaces } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();
  const workspaces = await getWorkspaces();

  if (!user) {
    return redirect("/sign-in");
  }

  if (!workspaces || workspaces?.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces?.documents[0].$id}`);
  }
}
