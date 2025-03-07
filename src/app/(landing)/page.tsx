import { getWorkspaces } from "@/features/workspaces/queries";
import { getCurrent } from "@/features/auth/queries";
import LandingScreen from "@/components/landing-screen";

export default async function Home() {
  const user = await getCurrent();
  const workspaces = await getWorkspaces();

  return <LandingScreen initialUser={user} initialWorkspaces={workspaces} />;
}
