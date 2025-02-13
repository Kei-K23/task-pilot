interface TaskOverviewPropertyProps {
  label: string;
  children: React.ReactNode;
}

export default function TaskOverviewProperty({
  label,
  children,
}: TaskOverviewPropertyProps) {
  return (
    <div className="flex items-center gap-x-8">
      <span className="min-w-[100px] text-muted-foreground text-[15px] font-semibold">
        {label}
      </span>
      {children}
    </div>
  );
}
