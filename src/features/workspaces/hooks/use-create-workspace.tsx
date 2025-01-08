import { parseAsBoolean, useQueryState } from "nuqs";

export const useCreateWorkspace = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-form",
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
