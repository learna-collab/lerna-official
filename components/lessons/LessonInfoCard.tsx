import { Card, CardContent } from "@/components/ui/card";
interface LessonInfoCardProps {
  label: string;
  value?: string | null;
}
export function LessonInfoCard({ label, value }: LessonInfoCardProps) {
  return (
    <Card>
      {" "}
      <CardContent className="p-4">
        {" "}
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {" "}
          {label}{" "}
        </p>{" "}
        <p className="mt-2 text-sm leading-relaxed">
          {" "}
          {value || "Not available"}{" "}
        </p>{" "}
      </CardContent>{" "}
    </Card>
  );
}
