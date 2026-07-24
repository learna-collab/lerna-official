"use client";

import {
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Percent,
  Timer,
  Trophy,
  User,
} from "lucide-react";

import { Attempt } from "@/app/types/cbt";

import StudentAvatar from "./StudentAvatar";
import ScoreBadge from "./ScoreBadge";
import StatusBadge from "./StatusBadge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttemptDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attempt: Attempt | null;
}

function formatDate(date?: string | null) {
  if (!date) return "--";

  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function duration(attempt: Attempt) {
  if (!attempt.completed_at) return "--";

  const start = new Date(attempt.started_at).getTime();
  const end = new Date(attempt.completed_at).getTime();

  const mins = Math.floor((end - start) / 60000);

  return `${mins} min`;
}

export default function AttemptDetailsDialog({
  open,
  onOpenChange,
  attempt,
}: AttemptDetailsDialogProps) {
  if (!attempt) return null;

  const studentName = attempt.student
    ? `${attempt.student.first_name} ${attempt.student.last_name}`
    : "Unknown Student";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Student Examination Result</DialogTitle>

          <DialogDescription>
            Complete summary of this student&apos;s CBT attempt.
          </DialogDescription>
        </DialogHeader>

        {/* ====================================== */}
        {/* Student */}
        {/* ====================================== */}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Student Information</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              <StudentAvatar
                firstName={attempt.student?.first_name}
                lastName={attempt.student?.last_name}
                size="lg"
              />

              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{studentName}</h3>

                <p className="text-sm text-muted-foreground">
                  Admission No: {attempt.student?.admission_number ?? "--"}
                </p>

                <StatusBadge passed={attempt.passed} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ====================================== */}
        {/* Score */}
        {/* ====================================== */}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Examination Performance</CardTitle>
          </CardHeader>

          <CardContent>
            <ScoreBadge
              score={attempt.score}
              percentage={attempt.percentage}
              totalMarks={attempt.exam?.total_marks}
            />
          </CardContent>
        </Card>

        {/* ====================================== */}
        {/* Stats */}
        {/* ====================================== */}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <ClipboardCheck className="h-8 w-8 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">Answered</p>

                <h3 className="text-2xl font-bold">
                  {attempt.answered_questions ?? 0}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <Percent className="h-8 w-8 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">Percentage</p>

                <h3 className="text-2xl font-bold">
                  {attempt.percentage.toFixed(1)}%
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <Timer className="h-8 w-8 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">Time Taken</p>

                <h3 className="text-2xl font-bold">{duration(attempt)}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <Trophy className="h-8 w-8 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">Result</p>

                <h3 className="text-lg font-semibold">
                  {attempt.passed ? "Passed" : "Failed"}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================== */}
        {/* Timeline */}
        {/* ====================================== */}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attempt Timeline</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-primary" />

              <div>
                <p className="font-medium">Started Examination</p>

                <p className="text-sm text-muted-foreground">
                  {formatDate(attempt.started_at)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />

              <div>
                <p className="font-medium">Submitted Examination</p>

                <p className="text-sm text-muted-foreground">
                  {formatDate(attempt.completed_at)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarClock className="mt-1 h-5 w-5 text-primary" />

              <div>
                <p className="font-medium">Total Duration</p>

                <p className="text-sm text-muted-foreground">
                  {duration(attempt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
