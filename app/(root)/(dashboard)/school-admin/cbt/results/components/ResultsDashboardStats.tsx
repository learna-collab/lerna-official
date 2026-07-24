"use client";

import { BarChart3, CheckCircle2, ClipboardCheck, Percent } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { CBTResultsDashboardStats } from "@/app/types/cbt";

interface ResultsDashboardStatsProps {
  stats: CBTResultsDashboardStats;
}

export default function ResultsDashboardStats({
  stats,
}: ResultsDashboardStatsProps) {
  const dashboardStats = [
    {
      title: "Total Exams",

      value: stats.total_exams,

      description: "Published and unpublished(draft) examinations",

      icon: ClipboardCheck,

      color: "text-primary",
    },

    {
      title: "Attempts",

      value: stats.total_attempts,

      description: "Student submissions",

      icon: BarChart3,

      color: "text-indigo-600",
    },

    {
      title: "Average Score",

      value: `${stats.average_percentage.toFixed(1)}%`,

      description: "Across all examinations",

      icon: Percent,

      color: "text-orange-500",
    },

    {
      title: "Pass Rate",

      value: `${stats.overall_pass_rate.toFixed(1)}%`,

      description: "Overall student success",

      icon: CheckCircle2,

      color:
        stats.overall_pass_rate >= 70
          ? "text-emerald-600"
          : stats.overall_pass_rate >= 50
            ? "text-amber-500"
            : "text-red-500",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="
              transition-all
              duration-200
              hover:shadow-md
              "
          >
            <CardContent
              className="
                flex
                items-center
                justify-between
                p-6
                "
            >
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.title}</p>

                <h2 className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </h2>

                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>

              <div className="rounded-xl bg-muted p-3">
                <Icon
                  className={`
                    h-8
                    w-8
                    ${stat.color}
                    `}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
