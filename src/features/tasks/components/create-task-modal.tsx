"use client";

import ResponsiveModal from "@/components/responsive-modal";
import { useOpenCreateTaskModal } from "../hooks/use-open-create-task-modal";
import CreateTaskForm from "./create-task-form";

export default function CreateTaskModal() {
  const { setIsOpen, isOpen, close } = useOpenCreateTaskModal();

  return (
    <ResponsiveModal
      isOpen={isOpen}
      setIsOpen={(e) => {
        setIsOpen({ openCreateTaskModal: e, initialTaskStatus: null });
      }}
    >
      <CreateTaskForm onCancel={close} />
    </ResponsiveModal>
  );
}
