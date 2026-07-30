"use client";

import { CheckCircle2, Clock3, Eye, FileText } from "lucide-react";

import { Exam } from "@/app/types/cbt";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ExamActions from "../components/ExamActions";
import ExamStatusBadge from "../components/ExamStatusBadge";

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
  onQuestions,
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
          <ExamStatusBadge published={exam.is_published} />

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
              <span>{exam.duration_minutes} Minutes</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total Marks
            </p>

            <div className="flex items-center gap-2 font-semibold">
              <FileText className="h-4 w-4 text-primary" />
              <span>{exam.total_marks}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />

            <div className="space-y-1">
              <p className="font-medium">Examination Status</p>

              <p className="text-sm text-muted-foreground">
                {exam.is_published
                  ? "This examination is published and available to eligible students."
                  : "This examination is currently in draft mode and is not visible to students."}
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
