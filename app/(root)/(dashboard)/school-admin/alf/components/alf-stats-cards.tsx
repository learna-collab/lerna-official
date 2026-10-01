"use client";

import { ALFUsageStats } from "@/app/services/alf.service";
import {
  Activity,
  CheckCircle2,
  Clock3,
  GraduationCap,
  PlayCircle,
} from "lucide-react";

interface ALFStatsCardsProps {
  stats: ALFUsageStats;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds < 60) {
    return `${seconds || 0}s`;
  }

  const totalMinutes = Math.floor(seconds / 60);

  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (!minutes) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

export function ALFStatsCards({ stats }: ALFStatsCardsProps) {
  const cards = [
    {
      title: "Total Sessions",
      value: stats.total_sessions.toLocaleString(),
      description: "ALF sessions started",
      icon: Activity,
    },
    {
      title: "Completed",
      value: stats.completed_sessions.toLocaleString(),
      description: `${stats.completion_rate.toFixed(1)}% completion rate`,
      icon: CheckCircle2,
    },
    {
      title: "Active Sessions",
      value: (
        stats.in_progress_sessions + stats.started_sessions
      ).toLocaleString(),
      description: "Currently active",
      icon: PlayCircle,
    },
    {
      title: "Teaching Time",
      value: formatDuration(stats.total_duration_seconds),
      description: "Total recorded ALF time",
      icon: Clock3,
    },
    {
      title: "Avg. Session",
      value: formatDuration(stats.average_duration_seconds),
      description: "Average session duration",
      icon: GraduationCap,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {card.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>

              <div className="rounded-lg bg-muted p-2">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
