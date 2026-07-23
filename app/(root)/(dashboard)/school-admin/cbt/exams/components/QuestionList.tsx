"use client";

import Link from "next/link";

import { FileQuestion, Loader2, Plus } from "lucide-react";

import { Question } from "@/app/types/cbt";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import QuestionCard from "./QuestionCard";

interface QuestionListProps {
  examId: string;

  questions: Question[];

  loading?: boolean;

  preview?: boolean;

  onAdd?: () => void;

  onEdit?: (question: Question) => void;

  onDelete?: (question: Question) => void;
}

export default function QuestionList({
  examId,
  questions,
  loading = false,
  preview = false,
  onAdd,
  onEdit,
  onDelete,
}: QuestionListProps) {
  const sortedQuestions = [...questions].sort(
    (a, b) => a.order_no - b.order_no,
  );

  const items = preview ? sortedQuestions.slice(0, 5) : sortedQuestions;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Questions</CardTitle>

          <CardDescription>
            {preview
              ? "Preview of examination questions."
              : "Manage examination questions."}
          </CardDescription>
        </div>

        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {/* ===================================== */}
        {/* Loading */}
        {/* ===================================== */}

        {loading && (
          <div className="flex h-72 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />

              <p className="text-sm text-muted-foreground">
                Loading questions...
              </p>
            </div>
          </div>
        )}

        {/* ===================================== */}
        {/* Empty */}
        {/* ===================================== */}

        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
            <FileQuestion className="mb-5 h-16 w-16 text-muted-foreground" />

            <h3 className="text-xl font-semibold">No Questions Yet</h3>

            <p className="mt-3 max-w-lg text-center text-sm leading-6 text-muted-foreground">
              This examination doesn&apos;t have any questions yet. Add your
              first question to begin creating the CBT examination.
            </p>

            {onAdd && (
              <Button className="mt-8" onClick={onAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Question
              </Button>
            )}
          </div>
        )}

        {/* ===================================== */}
        {/* Questions */}
        {/* ===================================== */}

        {!loading && items.length > 0 && (
          <div className="space-y-5">
            {items.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onEdit={onEdit ? () => onEdit(question) : undefined}
                onDelete={onDelete ? () => onDelete(question) : undefined}
              />
            ))}

            {/* Preview Footer */}

            {preview && questions.length > items.length && (
              <div className="pt-6 text-center">
                <Button variant="outline" asChild>
                  <Link href={`/school-admin/cbt/exams/${examId}/questions`}>
                    View All {questions.length} Questions
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
