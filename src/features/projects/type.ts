import { Models } from "node-appwrite";

export type Project = Models.Document & {
  name: string;
  imageUrl: string;
  workspaceId: string;
};

export type ProjectAnalysisResponse = {
  taskCount: number;
  taskDiff: number;
  assignedTaskCount: number;
  assignedTaskDiff: number;
  incompleteTaskCount: number;
  incompleteTaskDiff: number;
  completeTaskCount: number;
  completeTaskDiff: number;
  overDueTaskCount: number;
  overDueTaskDiff: number;
};
