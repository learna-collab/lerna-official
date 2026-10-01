"use client";

import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  PlayCircle,
  User,
  X,
  XCircle,
} from "lucide-react";

import type { ALFUsageSession } from "@/app/services/alf.service";

interface ALFSessionDetailDialogProps {
  session: ALFUsageSession | null;
  open: boolean;
  onClose: () => void;
}

function formatDuration(seconds: number): string {
  if (!seconds) {
    return "0 seconds";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    if (!minutes) {
      return `${remainingSeconds} seconds`;
    }

    return `${minutes}m ${remainingSeconds}s`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!remainingMinutes) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusConfig(status: ALFUsageSession["status"]) {
  switch (status) {
    case "COMPLETED":
      return {
        label: "Completed",
        className:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        icon: CheckCircle2,
      };

    case "IN_PROGRESS":
      return {
        label: "In progress",
        className:
          "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
        icon: Loader2,
      };

    case "STARTED":
      return {
        label: "Started",
        className:
          "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        icon: PlayCircle,
      };

    case "ABANDONED":
      return {
        label: "Abandoned",
        className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        icon: XCircle,
      };
  }
}

interface SectionProps {
  title: string;
  description: string;
  completed: boolean;
}

function ALFSection({ title, description, completed }: SectionProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          completed
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {completed ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Clock3 className="h-4 w-4" />
        )}
      </div>

      <div className="min-w-0">
        <p className="font-medium">{title}</p>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>

        <p
          className={`mt-2 text-xs font-medium ${
            completed
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground"
          }`}
        >
          {completed ? "Completed" : "Not completed"}
        </p>
      </div>
    </div>
  );
}

export function ALFSessionDetailDialog({
  session,
  open,
  onClose,
}: ALFSessionDetailDialogProps) {
  if (!open || !session) {
    return null;
  }

  const status = getStatusConfig(session.status);
  const StatusIcon = status.icon;

  const completedSections = [
    session.independent_reading_completed,
    session.mini_lesson_completed,
    session.case_study_completed,
    session.project_based_learning_completed,
    session.evaluation_completed,
  ].filter(Boolean).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b px-6 py-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />

              <p className="text-sm font-medium text-muted-foreground">
                ALF Session
              </p>
            </div>

            <h2 className="mt-1 truncate text-xl font-semibold">
              {session.lesson_title}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {session.subject_name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {/* Teacher / Class */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Teacher
              </div>

              <p className="mt-2 font-semibold">{session.teacher_name}</p>
            </div>

            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                Class
              </div>

              <p className="mt-2 font-semibold">{session.class_name}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">ALF Progress</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {completedSections} of 5 sections completed
                </p>
              </div>

              <p className="text-2xl font-semibold">
                {session.progress_percentage}%
              </p>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground transition-all"
                style={{
                  width: `${session.progress_percentage}%`,
                }}
              />
            </div>
          </div>

          {/* Status / timing */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Status</p>

              <span
                className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {status.label}
              </span>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Duration</p>

              <p className="mt-2 flex items-center gap-1.5 font-semibold">
                <Clock3 className="h-4 w-4 text-muted-foreground" />
                {formatDuration(session.duration_seconds)}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Started</p>

              <p className="mt-2 flex items-center gap-1.5 text-sm font-medium">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                {formatDateTime(session.started_at)}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Completed</p>

              <p className="mt-2 text-sm font-medium">
                {formatDateTime(session.completed_at)}
              </p>
            </div>
          </div>

          {/* ALF sections */}
          <div className="mt-6">
            <div className="mb-4">
              <h3 className="font-semibold">ALF Sections</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Section-by-section usage for this session.
              </p>
            </div>

            <div className="grid gap-3">
              <ALFSection
                title="Independent Reading"
                description="Teacher completed the independent reading section."
                completed={session.independent_reading_completed}
              />

              <ALFSection
                title="Mini Lesson"
                description="Teacher completed the mini lesson section."
                completed={session.mini_lesson_completed}
              />

              <ALFSection
                title="Case Study"
                description="Teacher completed the case study section."
                completed={session.case_study_completed}
              />

              <ALFSection
                title="Project-Based Learning"
                description="Teacher completed the project-based learning section."
                completed={session.project_based_learning_completed}
              />

              <ALFSection
                title="Evaluation"
                description="Teacher completed the evaluation section."
                completed={session.evaluation_completed}
              />
            </div>
          </div>

          {/* Activity */}
          <div className="mt-6 rounded-xl border p-5">
            <h3 className="font-semibold">Activity</h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Started at</p>

                <p className="mt-1 text-sm font-medium">
                  {formatDateTime(session.started_at)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Last activity</p>

                <p className="mt-1 text-sm font-medium">
                  {formatDateTime(session.last_activity_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
