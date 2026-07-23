"use client";

import { CheckCircle2, Clock3, FileQuestion, FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface ExamStatsProps {
  total: number;

  published: number;

  drafts: number;

  questions: number;
}

export function ExamStats({
  total,
  published,
  drafts,
  questions,
}: ExamStatsProps) {
  const stats = [
    {
      title: "Total Exams",
      value: total,
      icon: FileText,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: "Published",
      value: published,
      icon: CheckCircle2,
      color:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "Drafts",
      value: drafts,
      icon: Clock3,
      color:
        "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    {
      title: "Questions",
      value: questions,
      icon: FileQuestion,
      color:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{item.title}</p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  {item.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon className="h-7 w-7" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
