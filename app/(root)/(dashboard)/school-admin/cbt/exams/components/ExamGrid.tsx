"use client";

import { Exam } from "@/app/types/cbt";

import ExamCard from "./ExamCard";
import EmptyState from "./EmptyState";

interface ExamGridProps {
  exams: Exam[];

  publishingId?: string | null;

  deletingId?: string | null;

  onView?: (exam: Exam) => void;

  onEdit?: (exam: Exam) => void;

  onQuestions?: (exam: Exam) => void;

  onResults?: (exam: Exam) => void;

  onPublish?: (exam: Exam) => void;

  onDelete?: (exam: Exam) => void;

  emptyTitle?: string;

  emptyDescription?: string;
}

export default function ExamGrid({
  exams,
  publishingId,
  deletingId,
  onView,
  onEdit,
  onQuestions,
  onResults,
  onPublish,
  onDelete,
  emptyTitle = "No examinations found",
  emptyDescription = "Create your first examination to get started.",
}: ExamGridProps) {
  if (!exams.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {exams.map((exam) => (
        <ExamCard
          key={exam.id}
          exam={exam}
          publishing={publishingId === exam.id}
          deleting={deletingId === exam.id}
          onView={() => onView?.(exam)}
          onEdit={() => onEdit?.(exam)}
          onQuestions={() => onQuestions?.(exam)}
          onResults={() => onResults?.(exam)}
          onPublish={() => onPublish?.(exam)}
          onDelete={() => onDelete?.(exam)}
        />
      ))}
    </div>
  );
}
