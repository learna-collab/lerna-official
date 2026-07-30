"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileQuestion,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { CBTService } from "@/app/services/cbt.service";

import { Exam, Question } from "@/app/types/cbt";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

export default function ExamDetailsPage() {
  const { examId } = useParams<{
    examId: string;
  }>();

  const [loading, setLoading] = useState(true);

  const [exam, setExam] = useState<Exam | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);

  const loadExam = useCallback(async () => {
    try {
      setLoading(true);

      const response = await CBTService.getExam(examId);

      if (!response.success || !response.data) {
        toast.error(response.message);
        return;
      }

      setExam(response.data);

      setQuestions(response.data.questions ?? []);
    } catch {
      toast.error("Failed to load examination.");
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    void Promise.resolve().then(() => loadExam());
  }, [loadExam]);

  const stats = useMemo(() => {
    return {
      questions: questions.length,

      totalMarks: questions.reduce((sum, question) => sum + question.marks, 0),
    };
  }, [questions]);
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Button asChild variant="ghost" className="mb-4 px-0">
            <Link href="/school-admin/cbt/exams">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exams
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {loading ? "Loading..." : exam?.title}
            </h1>

            {!loading && exam && (
              <Badge variant={exam.is_published ? "default" : "secondary"}>
                {exam.is_published ? "Published" : "Draft"}
              </Badge>
            )}
          </div>

          <p className="mt-3 max-w-3xl text-muted-foreground">
            Review examination information, manage questions and publish the
            assessment when it is ready.
          </p>
        </div>

        {!loading && exam && (
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href={`/school-admin/cbt/exams/${exam.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>

            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {/* ====================================================== */}
      {/* Statistics */}
      {/* ====================================================== */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Questions</p>

              <h2 className="mt-2 text-3xl font-bold">{stats.questions}</h2>
            </div>

            <FileQuestion className="h-10 w-10 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Marks</p>

              <h2 className="mt-2 text-3xl font-bold">{stats.totalMarks}</h2>
            </div>

            <BookOpen className="h-10 w-10 text-indigo-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>

              <h2 className="mt-2 text-3xl font-bold">
                {exam?.duration_minutes ?? 0}
              </h2>

              <p className="text-xs text-muted-foreground">Minutes</p>
            </div>

            <Clock3 className="h-10 w-10 text-orange-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>

              <h2 className="mt-2 text-lg font-semibold">
                {exam?.is_published ? "Published" : "Draft"}
              </h2>
            </div>

            <CheckCircle2
              className={`h-10 w-10 ${
                exam?.is_published ? "text-green-600" : "text-gray-400"
              }`}
            />
          </CardContent>
        </Card>
      </div>
      {/* ====================================================== */}
      {/* Examination Information */}
      {/* ====================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>Examination Information</CardTitle>

          <CardDescription>
            Overview of the examination configuration and schedule.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">Loading examination...</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Left Column */}

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Examination Title
                  </p>

                  <p className="mt-1 font-semibold">{exam?.title}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Class</p>

                  <p className="mt-1 font-semibold">
                    {exam?.school_class?.name ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Subject</p>

                  <p className="mt-1 font-semibold">
                    {exam?.subject?.name ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Instructions</p>

                  <div className="mt-2 rounded-lg border bg-muted/30 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {exam?.instructions ||
                        "No examination instructions provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column */}

              <div className="space-y-6">
                <div className="rounded-xl border">
                  <div className="flex items-center gap-3 border-b p-4">
                    <Clock3 className="h-5 w-5 text-primary" />

                    <span className="font-medium">Examination Settings</span>
                  </div>

                  <div className="space-y-5 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration</span>

                      <span className="font-semibold">
                        {exam?.duration_minutes} mins
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Marks</span>

                      <span className="font-semibold">{exam?.total_marks}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Questions</span>

                      <span className="font-semibold">{questions.length}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>

                      <Badge
                        variant={exam?.is_published ? "default" : "secondary"}
                      >
                        {exam?.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* ====================================================== */}
      {/* Questions */}
      {/* ====================================================== */}

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Examination Questions</CardTitle>

            <CardDescription>
              Add, edit and organize questions for this examination.
            </CardDescription>
          </div>

          <Button asChild>
            <Link href={`/school-admin/cbt/exams/${examId}/questions`}>
              <Plus className="mr-2 h-4 w-4" />
              Manage Questions
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <p className="text-muted-foreground">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
              <FileQuestion className="mb-5 h-14 w-14 text-muted-foreground" />

              <h3 className="text-xl font-semibold">No Questions Yet</h3>

              <p className="mt-3 max-w-lg text-center text-sm text-muted-foreground">
                This examination doesn&apos;t have any questions yet. Start
                building the assessment by adding your first question.
              </p>

              <Button className="mt-8" asChild>
                <Link href={`/school-admin/cbt/exams/${examId}/questions`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Question
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {questions
                .sort((a, b) => a.order_no - b.order_no)
                .slice(0, 5)
                .map((question) => (
                  <div
                    key={question.id}
                    className="flex items-start justify-between rounded-xl border p-5 transition-colors hover:bg-muted/40"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          Question {question.order_no}
                        </Badge>

                        <Badge variant="secondary">
                          {question.marks} Marks
                        </Badge>
                      </div>

                      <h3 className="font-medium leading-6">
                        {question.question_text}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {question.options?.length ?? 0} options
                      </p>
                    </div>

                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/school-admin/cbt/exams/${examId}/questions`}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Manage
                      </Link>
                    </Button>
                  </div>
                ))}

              {questions.length > 5 && (
                <div className="pt-4 text-center">
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
      {/* ====================================================== */}
      {/* Quick Actions */}
      {/* ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>

            <CardDescription>
              Complete your examination setup before publishing it to students.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Button className="justify-start" variant="outline" asChild>
              <Link href={`/school-admin/cbt/exams/${examId}/questions`}>
                <Plus className="mr-2 h-4 w-4" />
                Add / Edit Questions
              </Link>
            </Button>

            <Button className="justify-start" variant="outline" asChild>
              <Link href={`/school-admin/cbt/exams/${examId}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Examination
              </Link>
            </Button>

            <Button
              className="justify-center"
              variant="outline"
              disabled={loading || questions.length === 0 || exam?.is_published}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Publish Examination
            </Button>

            <Button
              className="justify-start"
              variant="outline"
              disabled={!exam?.is_published}
              asChild={!!exam?.is_published}
            >
              {exam?.is_published ? (
                <Link href={`/school-admin/cbt/results?examId=${examId}`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Results
                </Link>
              ) : (
                <>
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Results
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>

            <CardDescription>Examination overview.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Questions</span>

              <span className="font-semibold">{questions.length}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Marks</span>

              <span className="font-semibold">{exam?.total_marks ?? 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Duration</span>

              <span className="font-semibold">
                {exam?.duration_minutes ?? 0} mins
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>

              <Badge variant={exam?.is_published ? "default" : "secondary"}>
                {exam?.is_published ? "Published" : "Draft"}
              </Badge>
            </div>

            <Separator />

            <div className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
              {exam?.is_published
                ? "This examination has been published and is available to students."
                : questions.length === 0
                  ? "Add at least one question before publishing this examination."
                  : "Review the examination details and publish it when you're ready."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
