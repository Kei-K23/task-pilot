import {
  addMonths,
  addYears,
  format,
  getDay,
  parseISO,
  startOfWeek,
  subMonths,
} from "date-fns";
import { Task, TASK_STATUS, TaskCalendarEventCard } from "../type";
import { enUS } from "date-fns/locale/en-US";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./task-calendar.css";
import TaskCalendarEventCardItem from "./task-calendar-event-card-item";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface TaskCalendarProps {
  data: Task[];
  isLoading: boolean;
}

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek,
  getDay,
  locales,
});

const CustomToolbar = ({
  value,
  handleDateNavigation,
}: {
  value: Date;
  handleDateNavigation: (action: "NEXT" | "PREV" | "TODAY") => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-x-4 mb-4 bg-muted py-2 px-4 rounded-lg">
      <Button
        size={"icon"}
        variant={"outline"}
        onClick={() => {
          handleDateNavigation("PREV");
        }}
      >
        <ChevronLeft />
      </Button>
      <div className="text-muted-foreground flex items-center gap-x-2">
        <CalendarDays
          className="size-5 cursor-pointer"
          onClick={() => {
            handleDateNavigation("TODAY");
          }}
        />
        <p>{format(new Date(value), "MMMM yyyy")}</p>
      </div>
      <Button
        size={"icon"}
        variant={"outline"}
        onClick={() => {
          handleDateNavigation("NEXT");
        }}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default function TaskCalendar({ data, isLoading }: TaskCalendarProps) {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  );

  const events: TaskCalendarEventCard[] = data.map((task) => ({
    $id: task.$id,
    title: task.name,
    status: task.status as TASK_STATUS,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    assignee: task.assignee,
    project: task.project,
  }));

  const handleDateNavigation = (action: "NEXT" | "PREV" | "TODAY") => {
    switch (action) {
      case "NEXT":
        setValue(addMonths(value, 1));
        break;
      case "PREV":
        setValue(subMonths(value, 1));
        break;
      case "TODAY":
        setValue(new Date());
        break;
      default:
        setValue(new Date());
        break;
    }
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        date={value}
        events={events}
        views={["month"]}
        defaultView="month"
        toolbar
        showAllEvents
        className="h-full"
        max={addYears(new Date().getFullYear(), 1)}
        formats={{
          weekdayFormat: (date, culture, localizer) =>
            localizer?.format(date, "EEE", culture) ?? "",
        }}
        components={{
          eventWrapper: ({ event }) => (
            <TaskCalendarEventCardItem event={event} />
          ),
          toolbar: () => (
            <CustomToolbar
              value={value}
              handleDateNavigation={handleDateNavigation}
            />
          ),
        }}
      />
    </div>
  );
}
