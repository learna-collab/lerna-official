"use client";

import { BookOpenCheck, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyHistoryProps {
  onBrowseExams?: () => void;
}

export default function EmptyHistory({ onBrowseExams }: EmptyHistoryProps) {
  return (
    <Card className="border-dashed shadow-sm">
      <CardContent className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-5">
          <GraduationCap className="h-12 w-12 text-primary" />
        </div>

        <h2 className="text-2xl font-bold">No Examination History Yet</h2>

        <p className="mt-3 max-w-xl text-muted-foreground">
          You haven&apos;t completed any computer-based examinations yet. Once
          you finish an exam, your scores and performance history will appear
          here.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onBrowseExams}>
            <BookOpenCheck className="mr-2 h-4 w-4" />
            Browse Available Exams
          </Button>
        </div>

        <div className="mt-10 grid w-full max-w-2xl gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold">Take Exams</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Complete your assigned CBT examinations online.
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <h3 className="font-semibold">View Results</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Review your scores, percentages, and performance after submission.
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <h3 className="font-semibold">Track Progress</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Monitor your academic improvement across multiple examinations.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
