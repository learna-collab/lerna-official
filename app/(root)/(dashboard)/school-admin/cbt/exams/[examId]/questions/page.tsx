"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Loader2,
  Plus,
} from "lucide-react";
import { Upload } from "lucide-react";

import { toast } from "sonner";

import { CBTService } from "@/app/services/cbt.service";

import { Exam, Question } from "@/app/types/cbt";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import QuestionCard from "../../components/QuestionCard";
import QuestionForm from "../../components/QuestionForm";
import BatchUploadDialog from "../../components/BatchUploadDialog";

export default function ExamQuestionsPage() {
  const { examId } = useParams<{
    examId: string;
  }>();

  const [loading, setLoading] = useState(true);

  const [exam, setExam] = useState<Exam | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);

  const [openForm, setOpenForm] = useState(false);

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [batchUploadOpen, setBatchUploadOpen] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );

  const [deleting, setDeleting] = useState(false);

  const [publishing, setPublishing] = useState(false);

  const loadExam = useCallback(async () => {
    try {
      setLoading(true);

      const response = await CBTService.getExam(examId);

      if (!response.success) {
        toast.error(response.message);

        return;
      }
      console.log(response.data);
      setExam(response.data);

      setQuestions(response.data?.questions ?? []);
    } catch {
      toast.error("Failed to load examination.");
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    void Promise.resolve().then(() => loadExam());
  }, [loadExam]);

  async function deleteQuestion() {
    if (!selectedQuestion) return;

    try {
      setDeleting(true);

      const response = await CBTService.deleteQuestion(selectedQuestion.id);

      if (!response.success) {
        toast.error(response.message);

        return;
      }

      toast.success(response.message);

      setDeleteDialogOpen(false);

      setSelectedQuestion(null);

      await loadExam();
    } catch {
      toast.error("Unable to delete question.");
    } finally {
      setDeleting(false);
    }
  }

  async function publishExam() {
    if (!exam) return;

    try {
      setPublishing(true);

      const response = await CBTService.publishExam(exam.id);

      if (!response.success) {
        toast.error(response.message);

        return;
      }

      toast.success("Exam published successfully.");

      setPublishDialogOpen(false);

      await loadExam();
    } catch {
      toast.error("Unable to publish exam.");
    } finally {
      setPublishing(false);
    }
  }

  const stats = useMemo(() => {
    return {
      questions: questions.length,

      marks: questions.reduce((sum, q) => sum + q.marks, 0),

      published: exam?.is_published ?? false,

      duration: exam?.duration_minutes ?? 0,
    };
  }, [exam, questions]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Button asChild variant="ghost" className="px-0">
            <Link href="/school-admin/cbt/exams">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exams
            </Link>
          </Button>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {exam?.title ?? "Loading Examination..."}
              </h1>

              {exam && (
                <Badge variant={exam.is_published ? "default" : "secondary"}>
                  {exam.is_published ? "Published" : "Draft"}
                </Badge>
              )}
            </div>

            <p className="max-w-3xl text-muted-foreground">
              Create questions, edit existing ones, configure the examination,
              and publish it when everything is ready.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setEditingQuestion(null);
              setOpenForm(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
          <Button variant="outline" onClick={() => setBatchUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Batch Upload
          </Button>

          <Button
            disabled={stats.questions === 0 || stats.published}
            onClick={() => setPublishDialogOpen(true)}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Publish Exam
          </Button>
        </div>
      </div>

      <Separator />

      {/* ====================================================== */}
      {/* Statistics */}
      {/* ====================================================== */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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

              <h2 className="mt-2 text-3xl font-bold">{stats.marks}</h2>
            </div>

            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>

              <h2 className="mt-2 text-3xl font-bold">{stats.duration}</h2>

              <p className="text-xs text-muted-foreground">minutes</p>
            </div>

            <Clock3 className="h-10 w-10 text-orange-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>

              <Badge
                className="mt-3"
                variant={stats.published ? "default" : "secondary"}
              >
                {stats.published ? "Published" : "Draft"}
              </Badge>
            </div>

            <CheckCircle2
              className={`h-10 w-10 ${
                stats.published ? "text-green-600" : "text-muted-foreground"
              }`}
            />
          </CardContent>
        </Card>
      </div>
      {/* ====================================================== */}
      {/* Exam Information */}
      {/* ====================================================== */}

      {exam && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Examination Information</CardTitle>

            <CardDescription>
              General details and configuration for this CBT examination.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>

                <p className="mt-2 text-lg font-semibold">
                  {exam.duration_minutes} minutes
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Total Marks</p>

                <p className="mt-2 text-lg font-semibold">{exam.total_marks}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold">Instructions</h3>

              {exam.instructions ? (
                <div className="rounded-lg bg-muted/40 p-4 leading-7 text-muted-foreground">
                  {exam.instructions}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No examination instructions have been provided.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ====================================================== */}
      {/* Questions */}
      {/* ====================================================== */}

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Examination Questions</CardTitle>

            <CardDescription>
              Manage all questions belonging to this examination.
            </CardDescription>
          </div>

          <Button
            onClick={() => {
              setEditingQuestion(null);

              setOpenForm(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex h-72 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />

                <p className="text-sm text-muted-foreground">
                  Loading examination...
                </p>
              </div>
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
              <FileQuestion className="mb-5 h-16 w-16 text-muted-foreground" />

              <h3 className="text-xl font-semibold">No Questions Yet</h3>

              <p className="mt-3 max-w-lg text-center text-sm leading-6 text-muted-foreground">
                This examination doesn&apos;t have any questions yet. Add your
                first question to begin building the CBT examination.
              </p>

              <Button
                className="mt-8"
                onClick={() => {
                  setEditingQuestion(null);

                  setOpenForm(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Question
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {questions
                .sort((a, b) => a.order_no - b.order_no)
                .map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    onEdit={() => {
                      setEditingQuestion(question);

                      setOpenForm(true);
                    }}
                    onDelete={() => {
                      setSelectedQuestion(question);

                      setDeleteDialogOpen(true);
                    }}
                  />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* ====================================================== */}
      {/* Question Form */}
      {/* ====================================================== */}

      <QuestionForm
        open={openForm}
        onOpenChange={setOpenForm}
        examId={examId}
        question={editingQuestion}
        onSaved={async () => {
          setOpenForm(false);
          setEditingQuestion(null);

          await loadExam();
        }}
      />

      <BatchUploadDialog
        open={batchUploadOpen}
        onOpenChange={setBatchUploadOpen}
        examId={examId}
        onUploaded={loadExam}
      />

      {/* ====================================================== */}
      {/* Delete Question */}
      {/* ====================================================== */}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. The selected question and all its
              options will be permanently removed from this examination.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();

                void deleteQuestion();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Question"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ====================================================== */}
      {/* Publish Exam */}
      {/* ====================================================== */}

      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Publish Examination
            </AlertDialogTitle>

            <AlertDialogDescription>
              Once this examination is published, students assigned to the class
              will be able to take it within the scheduled time.
              <br />
              <br />
              Ensure all questions, marks and examination settings are correct
              before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={publishing}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();

                void publishExam();
              }}
              disabled={publishing}
            >
              {publishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Publish Exam
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
