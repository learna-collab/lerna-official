import { BookOpen } from "lucide-react";
interface LessonEmptyStateProps {
  title?: string;
  description?: string;
}
export function LessonEmptyState({
  title = "No lessons found",
  description = "Try adjusting your filters or upload a lesson note.",
}: LessonEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-16 text-center">
      {" "}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        {" "}
        <BookOpen className="h-7 w-7 text-muted-foreground" />{" "}
      </div>{" "}
      <h3 className="text-lg font-semibold">{title}</h3>{" "}
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {" "}
        {description}{" "}
      </p>{" "}
    </div>
  );
}
