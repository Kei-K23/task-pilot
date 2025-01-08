"use client";

import ResponsiveModal from "@/components/responsive-modal";
import CreateWorkspacesForm from "./create-workspaces-form";

export default function CreateWorkspacesModal() {
  return (
    <ResponsiveModal isOpen setIsOpen={() => {}}>
      <CreateWorkspacesForm />
    </ResponsiveModal>
  );
}
