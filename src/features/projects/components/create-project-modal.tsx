"use client";

import ResponsiveModal from "@/components/responsive-modal";
import { useOpenCreateProjectModal } from "../hooks/use-open-create-project-modal";
import CreateProjectForm from "./create-project-form";

export default function CreateProjectModal() {
  const { setIsOpen, isOpen, close } = useOpenCreateProjectModal();

  return (
    <ResponsiveModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
}
