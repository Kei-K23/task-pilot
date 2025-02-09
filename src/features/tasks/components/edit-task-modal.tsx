"use client";

import ResponsiveModal from "@/components/responsive-modal";
import { useOpenEditTaskModal } from "../hooks/use-open-edit-task-modal";
import EditTaskForm from "./edit-task-form";
import { useGetTaskById } from "../api/use-get-task-by-id";
import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";

export default function EditTaskModal() {
  const workspaceId = useGetWorkspaceParam();
  const { setIsOpen, editTaskForm, taskId, close } = useOpenEditTaskModal();
  const { data: task, isLoading } = useGetTaskById({
    workspaceId,
    taskId: taskId || "",
  });

  if (!isLoading && !task) {
    return null;
  }

  return (
    <ResponsiveModal
      isOpen={editTaskForm}
      setIsOpen={(e) => {
        setIsOpen({ editTaskForm: e, taskId: null });
      }}
    >
      {/* TODO Implement loading skeleton form */}
      {!task && isLoading ? (
        <p>loading...</p>
      ) : (
        <EditTaskForm onCancel={close} initValue={task!} />
      )}
    </ResponsiveModal>
  );
}
