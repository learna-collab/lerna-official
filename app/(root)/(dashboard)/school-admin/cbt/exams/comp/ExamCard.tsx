"use client";

import { CalendarDays, CheckCircle2, Clock3, Eye } from "lucide-react";

import { format } from "date-fns";

import { Exam } from "@/app/types/cbt";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import ExamActions from "./ExamActions";
import ExamStatusBadge from "./ExamStatusBadge";

interface ExamCardProps {
  exam: Exam;

  publishing?: boolean;

  deleting?: boolean;

  onView?: () => void;

  onEdit?: () => void;

  onQuestions?: () => void;

  onResults?: () => void;

  onPublish?: () => void;

  onDelete?: () => void;
}

export default function ExamCard({
  exam,
  publishing = false,
  deleting = false,
  onView,
  onEdit,
  onQuestions,
  onResults,
  onPublish,
  onDelete,
}: ExamCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <CardHeader className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <CardTitle className="line-clamp-2 text-lg">{exam.title}</CardTitle>

            <CardDescription className="line-clamp-2">
              {exam.instructions || "No instructions provided."}
            </CardDescription>
          </div>

          <ExamActions
            exam={exam}
            publishing={publishing}
            deleting={deleting}
            onPublish={onPublish}
            onDelete={onDelete}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ExamStatusBadge
            published={exam.is_published}
            startsAt={exam.starts_at}
            endsAt={exam.ends_at}
          />

          <Badge variant="outline">{exam.total_marks} Marks</Badge>

          <Badge variant="secondary">{exam.duration_minutes} mins</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-5">
        <div className="grid grid-cols-2 gap-4 rounded-xl border bg-muted/40 p-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Duration
            </p>

            <div className="flex items-center gap-2 font-semibold">
              <Clock3 className="h-4 w-4 text-primary" />
              <span>{exam.duration_minutes} mins</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total Marks
            </p>

            <p className="text-lg font-semibold">{exam.total_marks}</p>
          </div>
        </div>

        <div className="rounded-xl border">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Start Date</span>
            </div>

            <span className="text-sm font-medium">
              {format(new Date(exam.starts_at), "PPP")}
            </span>
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>End Date</span>
            </div>

            <span className="text-sm font-medium">
              {format(new Date(exam.ends_at), "PPP")}
            </span>
          </div>
        </div>

        <div className="rounded-xl border bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />

            <div className="space-y-1">
              <p className="font-medium">Examination Status</p>

              <p className="text-sm text-muted-foreground">
                {exam.is_published
                  ? "This examination has been published and is available according to its scheduled start time."
                  : "This examination is still in draft mode and is not yet available to students."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 border-t bg-muted/20 p-6">
        <Button variant="outline" className="flex-1" onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>

        <Button className="flex-1" onClick={onQuestions}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Questions
        </Button>
      </CardFooter>
    </Card>
  );
}
