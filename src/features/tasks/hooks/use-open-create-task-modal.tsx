import { parseAsBoolean, parseAsStringEnum, useQueryStates } from "nuqs";
import { TASK_STATUS } from "../type";

export const useOpenCreateTaskModal = () => {
  const [{ openCreateTaskModal, initialTaskStatus }, setIsOpen] =
    useQueryStates({
      openCreateTaskModal: parseAsBoolean
        .withDefault(false)
        .withOptions({ clearOnDefault: true }),
      initialTaskStatus: parseAsStringEnum(Object.values(TASK_STATUS)),
    });

  const open = () => setIsOpen({ openCreateTaskModal: true });
  const close = () => setIsOpen({ openCreateTaskModal: false });

  return {
    open,
    close,
    setIsOpen,
    isOpen: openCreateTaskModal,
    initialTaskStatus,
  };
};
