import { parseAsBoolean, useQueryState } from "nuqs";

export const useOpenCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task-form",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    open,
    close,
    isOpen,
    setIsOpen,
  };
};
