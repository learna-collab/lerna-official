"use client";

import { Clock3, BookOpen, CalendarDays, GraduationCap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { StudentExam } from "@/app/types/cbt";

interface ExamHeaderProps {
  exam: StudentExam;
}

export default function ExamHeader({ exam }: ExamHeaderProps) {
  const startsAt = new Date(exam.starts_at).toLocaleString();
  const endsAt = new Date(exam.ends_at).toLocaleString();

  return (
    <div className="space-y-6 rounded-xl border bg-background p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Badge className="w-fit">{exam.subject_name}</Badge>

          <h1 className="text-3xl font-bold tracking-tight">{exam.title}</h1>

          {exam.instructions && (
            <p className="max-w-3xl text-muted-foreground">
              {exam.instructions}
            </p>
          )}
        </div>

        <Badge
          variant="secondary"
          className="w-fit px-4 py-2 text-sm font-semibold"
        >
          {exam.total_marks} Marks
        </Badge>
      </div>

      <Separator />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center gap-3 rounded-lg border p-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Class</p>

            <p className="font-semibold">{exam.class_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Questions</p>

            <p className="font-semibold">{exam.question_count}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <Clock3 className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Duration</p>

            <p className="font-semibold">{exam.duration_minutes} minutes</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Available</p>

            <p className="text-sm font-medium">{startsAt}</p>

            <p className="text-xs text-muted-foreground">until {endsAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
