import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface ALFSectionCardProps {
  title: string;
  minutes: number;
  content?: string | null;
}
export function ALFSectionCard({
  title,
  minutes,
  content,
}: ALFSectionCardProps) {
  return (
    <Card className="h-full">
      {" "}
      <CardHeader className="pb-3">
        {" "}
        <div className="flex items-center justify-between gap-3">
          {" "}
          <CardTitle className="text-base">{title}</CardTitle>{" "}
          <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
            {" "}
            <Clock className="h-3 w-3" /> {minutes} mins{" "}
          </div>{" "}
        </div>{" "}
      </CardHeader>{" "}
      <CardContent>
        {" "}
        {content ? (
          <p className="whitespace-pre-line text-sm leading-6"> {content} </p>
        ) : (
          <p className="text-sm italic text-muted-foreground">
            {" "}
            No content extracted for this section.{" "}
          </p>
        )}{" "}
      </CardContent>{" "}
    </Card>
  );
}
