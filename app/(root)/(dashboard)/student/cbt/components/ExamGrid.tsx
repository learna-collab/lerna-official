"use client";

import { GraduationCap } from "lucide-react";

import type { StudentExam } from "@/app/types/cbt";

import { ExamCard } from "./ExamCard";

interface ExamGridProps {
  exams: StudentExam[];
}

export function ExamGrid({ exams }: ExamGridProps) {
  if (exams.length === 0) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <GraduationCap className="h-8 w-8 text-muted-foreground" />
        </div>

        <h3 className="mt-5 text-lg font-semibold">No Available Exams</h3>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          There are currently no examinations available for you. Once your
          teachers publish an exam, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </div>
  );
}
