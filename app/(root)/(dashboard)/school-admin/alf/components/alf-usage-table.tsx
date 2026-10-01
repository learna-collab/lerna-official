"use client";

import {
  CheckCircle2,
  Clock3,
  Loader2,
  PlayCircle,
  XCircle,
} from "lucide-react";

import type { ALFUsageSession } from "@/app/services/alf.service";

interface ALFUsageTableProps {
  sessions: ALFUsageSession[];
  onSelect: (session: ALFUsageSession) => void;
}

function formatDuration(seconds: number): string {
  if (!seconds) {
    return "0s";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}

function statusConfig(status: ALFUsageSession["status"]) {
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

export function ALFUsageTable({ sessions, onSelect }: ALFUsageTableProps) {
  if (!sessions.length) {
    return (
      <div className="rounded-xl border bg-card px-6 py-16 text-center shadow-sm">
        <Clock3 className="mx-auto h-10 w-10 text-muted-foreground" />

        <h3 className="mt-4 text-sm font-semibold">No ALF sessions found</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Try changing your filters or wait for teachers to use an ALF lesson.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                Teacher
              </th>

              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                Lesson
              </th>

              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                Class
              </th>

              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                Progress
              </th>

              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                Duration
              </th>

              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                Started
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {sessions.map((session) => {
              const status = statusConfig(session.status);

              const StatusIcon = status.icon;

              return (
                <tr
                  key={session.id}
                  onClick={() => onSelect(session)}
                  className="cursor-pointer transition hover:bg-muted/40"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium">{session.teacher_name}</p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {session.subject_name}
                    </p>
                  </td>

                  <td className="max-w-[280px] px-5 py-4">
                    <p className="truncate font-medium">
                      {session.lesson_title}
                    </p>
                  </td>

                  <td className="px-5 py-4">{session.class_name}</td>

                  <td className="px-5 py-4">
                    <div className="w-32">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>

                        <span className="font-medium">
                          {session.progress_percentage}%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-foreground transition-all"
                          style={{
                            width: `${session.progress_percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {status.label}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    {formatDuration(session.duration_seconds)}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                    {new Date(session.started_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
