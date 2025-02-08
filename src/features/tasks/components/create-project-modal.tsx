"use client";

import ResponsiveModal from "@/components/responsive-modal";
import { useCreateProject } from "../hooks/use-create-project";
import CreateProjectForm from "./create-project-form";

export default function CreateProjectModal() {
  const { setIsOpen, isOpen, close } = useCreateProject();

  return (
    <ResponsiveModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
}
