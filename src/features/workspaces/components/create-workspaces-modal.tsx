"use client";

import ResponsiveModal from "@/components/responsive-modal";
import CreateWorkspacesForm from "./create-workspaces-form";
import { useCreateWorkspace } from "../hooks/use-create-workspace";

export default function CreateWorkspacesModal() {
  const { setIsOpen, isOpen, close } = useCreateWorkspace();
  return (
    <ResponsiveModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <CreateWorkspacesForm onCancel={close} />
    </ResponsiveModal>
  );
}
