"use server";

import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Project } from "./type";

export const getProjectById = async ({ projectId }: { projectId: string }) => {
  try {
    const { databases } = await createSessionClient();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    return project;
  } catch {
    return null;
  }
};
