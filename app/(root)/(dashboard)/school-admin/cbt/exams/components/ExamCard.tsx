"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  CalendarDays,
  Clock3,
  MoreVertical,
  Pencil,
  Eye,
  CheckCircle2,
  Trash2,
  Trophy,
  Loader2,
} from "lucide-react";

import { format } from "date-fns";

import { CBTService } from "@/app/services/cbt.service";
import { Exam } from "@/app/types/cbt";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExamCardProps {
  exam: Exam;
  onRefresh: () => void;
}

export function ExamCard({ exam, onRefresh }: ExamCardProps) {
  const router = useRouter();

  const [publishing, setPublishing] = useState(false);

  const [deleting, setDeleting] = useState(false);

  async function handlePublish() {
    try {
      setPublishing(true);

      const response = await CBTService.publishExam(exam.id);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success("Exam published successfully.");

      onRefresh();
    } catch {
      toast.error("Failed to publish exam.");
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);

      const response = await CBTService.deleteExam(exam.id);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success("Exam deleted.");

      onRefresh();
    } catch {
      toast.error("Unable to delete exam.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="group flex h-full flex-col border transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <CardTitle className="line-clamp-2 text-lg">{exam.title}</CardTitle>

            <CardDescription className="line-clamp-2">
              {exam.instructions || "No instructions provided."}
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link
                  href={`/school-admin/cbt/exams/${exam.id}`}
                  className="flex cursor-pointer items-center"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Examination
                </Link>
              </DropdownMenuItem>

              {!exam.is_published && (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/school-admin/cbt/exams/${exam.id}/edit`}
                    className="flex cursor-pointer items-center"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Examination
                  </Link>
                </DropdownMenuItem>
              )}

              {!exam.is_published && (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/school-admin/cbt/exams/${exam.id}/questions`}
                    className="flex cursor-pointer items-center"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Manage Questions
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem asChild>
                <Link
                  href={`/school-admin/cbt/exams/${exam.id}/results`}
                  className="flex cursor-pointer items-center"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  View Results
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {!exam.is_published && (
                <DropdownMenuItem disabled={publishing} onClick={handlePublish}>
                  {publishing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                      Publish Exam
                    </>
                  )}
                </DropdownMenuItem>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Exam
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Examination?</AlertDialogTitle>

                    <AlertDialogDescription>
                      This action cannot be undone. The exam, its questions,
                      answers and results will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                      disabled={deleting}
                      onClick={handleDelete}
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={exam.is_published ? "default" : "secondary"}>
            {exam.is_published ? "Published" : "Draft"}
          </Badge>

          <Badge variant="outline">{exam.total_marks} Marks</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-5">
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/40 p-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Duration
            </p>

            <div className="mt-2 flex items-center gap-2 font-semibold">
              <Clock3 className="h-4 w-4 text-primary" />
              {exam.duration_minutes} mins
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Total Marks
            </p>

            <p className="mt-2 font-semibold">{exam.total_marks}</p>
          </div>
        </div>
        <div className="rounded-xl border bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />

            <div className="space-y-2">
              <p className="font-medium">Examination Status</p>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {exam.is_published
                  ? "This examination has been published and is available for students."
                  : "This examination is still in draft mode and cannot be accessed by students until it is published."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3">
        <Button className="flex-1" variant="outline" asChild>
          <Link href={`/school-admin/cbt/exams/${exam.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>

        <Button
          className="flex-1"
          disabled={exam.is_published}
          onClick={() =>
            router.push(`/school-admin/cbt/exams/${exam.id}/questions`)
          }
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Questions
        </Button>
      </CardFooter>
    </Card>
  );
}
