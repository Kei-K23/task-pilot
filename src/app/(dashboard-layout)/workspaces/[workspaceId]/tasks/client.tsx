"use client";

import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";

export default function TasksClientPage() {
  return (
    <div>
      <h2 className="mb-5 text-2xl font-semibold">Tasks</h2>
      <TaskViewSwitcher showProjectFilter={false} />
    </div>
  );
}
