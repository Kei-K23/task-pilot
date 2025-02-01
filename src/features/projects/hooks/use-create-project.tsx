import { parseAsBoolean, useQueryState } from "nuqs";

export const useCreateProject = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-project-form",
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
