"use client";

import { Button } from "@/components/ui/button";
import { Project } from "../type";
import ProjectAvatar from "./project-avatar";
import { Edit } from "lucide-react";
import Link from "next/link";
import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";

interface ProjectScreenProps {
  project: Project;
}

export default function ProjectScreen({ project }: ProjectScreenProps) {
  const workspaceId = useGetWorkspaceParam();
  const fullHref = `/workspaces/${workspaceId}/projects/${project.$id}`;

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="flex items-center justify-between gap-x-4">
        <ProjectAvatar imageUrl={project.imageUrl} name={project.name} />
        <Link href={`${fullHref}/settings`}>
          <Button>
            <Edit /> Edit Project
          </Button>
        </Link>
      </div>
    </div>
  );
}
