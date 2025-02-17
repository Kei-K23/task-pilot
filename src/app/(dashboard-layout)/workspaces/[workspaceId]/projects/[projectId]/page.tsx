import PageNotFound from "@/components/page-not-found";
import { getCurrent } from "@/features/auth/queries";
import ProjectScreen from "@/features/projects/components/project-screen";
import { getProjectById } from "@/features/projects/queries";
import { redirect } from "next/navigation";

interface ProjectIdPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectIdPage({ params }: ProjectIdPageProps) {
  const { projectId } = await params;
  const user = await getCurrent();

  if (!user) {
    return redirect("/sign-in");
  }

  const project = await getProjectById({ projectId });

  if (!project) {
    return <PageNotFound />;
  }

  return <ProjectScreen project={project} />;
}
