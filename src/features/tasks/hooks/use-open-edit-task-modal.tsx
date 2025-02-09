import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export const useOpenEditTaskModal = () => {
  const [{ editTaskForm, taskId }, setIsOpen] = useQueryStates({
    editTaskForm: parseAsBoolean
      .withDefault(false)
      .withOptions({ clearOnDefault: true }),
    taskId: parseAsString,
  });

  const open = () => setIsOpen({ editTaskForm: true });
  const close = () => setIsOpen({ editTaskForm: false });

  return {
    editTaskForm,
    taskId,
    open,
    close,
    setIsOpen,
  };
};
