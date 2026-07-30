import { Badge } from "@/components/ui/badge";
interface LessonHeaderProps {
  title: string;
  topic: string;
  weekNumber: number;
  lessonDay: string;
}
export function LessonHeader({
  title,
  topic,
  weekNumber,
  lessonDay,
}: LessonHeaderProps) {
  return (
    <div className="space-y-3">
      {" "}
      <div className="flex flex-wrap items-center gap-2">
        {" "}
        <Badge variant="secondary">Week {weekNumber}</Badge>{" "}
        <Badge>{lessonDay}</Badge>{" "}
      </div>{" "}
      <div>
        {" "}
        <h1 className="text-2xl font-bold tracking-tight"> {title} </h1>{" "}
        <p className="text-muted-foreground mt-1"> {topic} </p>{" "}
      </div>{" "}
    </div>
  );
}
