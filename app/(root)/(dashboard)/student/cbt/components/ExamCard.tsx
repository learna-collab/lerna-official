"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Play,
  RotateCcw,
  Trophy,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import type { ExamAttemptStatus, StudentExam } from "@/app/types/cbt";

interface ExamCardProps {
  exam: StudentExam;
}

const statusStyles: Record<
  ExamAttemptStatus,
  {
    label: string;
    badge: string;
    button: string;
  }
> = {
  NOT_STARTED: {
    label: "Ready",
    badge: "border border-blue-200 bg-blue-50 text-blue-700",
    button: "bg-primary hover:bg-primary/90",
  },

  IN_PROGRESS: {
    label: "In Progress",
    badge: "border border-amber-200 bg-amber-50 text-amber-700",
    button: "bg-amber-600 hover:bg-amber-700",
  },

  COMPLETED: {
    label: "Completed",
    badge: "border border-green-200 bg-green-50 text-green-700",
    button: "",
  },
};

export function ExamCard({ exam }: ExamCardProps) {
  const status = statusStyles[exam.attempt_status];

  function renderAction() {
    switch (exam.attempt_status) {
      case "NOT_STARTED":
        return (
          <Button asChild size="lg" className={`w-full ${status.button}`}>
            <Link href={`/student/cbt/take/${exam.id}`}>
              <Play className="mr-2 h-4 w-4" />
              Start Examination
            </Link>
          </Button>
        );

      case "IN_PROGRESS":
        return (
          <Button asChild size="lg" className={`w-full ${status.button}`}>
            <Link href={`/student/cbt/take/${exam.attempt_id}`}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Resume Examination
            </Link>
          </Button>
        );

      case "COMPLETED":
        return (
          <Button asChild size="lg" variant="outline" className="w-full">
            <Link href={`/student/cbt/result/${exam.attempt_id}`}>
              <Trophy className="mr-2 h-4 w-4" />
              View Result
            </Link>
          </Button>
        );
    }
  }

  return (
    <Card
      className="
        flex h-full flex-col
        rounded-xl
        border
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-primary/30
        hover:shadow-lg
      "
    >
      <CardHeader className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="line-clamp-2 text-lg font-semibold tracking-tight">
              {exam.title}
            </h3>

            <p className="text-sm text-muted-foreground">{exam.subject_name}</p>
          </div>

          <Badge className={status.badge}>{status.label}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">Class</p>

              <p className="font-medium">{exam.class_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">Questions</p>

              <p className="font-medium">{exam.question_count}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock3 className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">Duration</p>

              <p className="font-medium">{exam.duration_minutes} mins</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">Total Marks</p>

              <p className="font-medium">{exam.total_marks}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="mt-auto space-y-6">
        {exam.instructions && (
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Instructions
            </p>

            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
              {exam.instructions}
            </p>
          </div>
        )}

        {renderAction()}
      </CardContent>
    </Card>
  );
}
