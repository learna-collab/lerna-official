"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Pencil, Trash2 } from "lucide-react";

import { Exam } from "@/app/types/cbt";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ExamHeaderProps {
  exam: Exam | null;
  loading?: boolean;
  backHref?: string;

  onPublish?: () => void;
  onDelete?: () => void;

  publishing?: boolean;
  deleting?: boolean;

  showDelete?: boolean;
  showPublish?: boolean;
  showEdit?: boolean;

  editHref?: string;

  children?: React.ReactNode;
}

export default function ExamHeader({
  exam,
  loading = false,
  backHref = "/school-admin/cbt/exams",

  onPublish,
  onDelete,

  publishing = false,
  deleting = false,

  showDelete = true,
  showPublish = true,
  showEdit = true,

  editHref,

  children,
}: ExamHeaderProps) {
  const title = loading
    ? "Loading Examination..."
    : (exam?.title ?? "Examination");

  const canPublish =
    !!exam &&
    !exam.is_published &&
    (exam.questions?.length ?? 0) > 0 &&
    !publishing;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-4">
        <Button asChild variant="ghost" className="px-0">
          <Link href={backHref}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exams
          </Link>
        </Button>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

            {exam && (
              <Badge variant={exam.is_published ? "default" : "secondary"}>
                {exam.is_published ? "Published" : "Draft"}
              </Badge>
            )}
          </div>

          <p className="max-w-3xl text-muted-foreground">
            Manage examination details, questions, and publishing status from
            one place.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {children}

        {showEdit && exam && (
          <Button variant="outline" asChild>
            <Link href={editHref ?? `/school-admin/cbt/exams/${exam.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        )}

        {showPublish && exam && !exam.is_published && (
          <Button onClick={onPublish} disabled={!canPublish || publishing}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {publishing ? "Publishing..." : "Publish Exam"}
          </Button>
        )}

        {showDelete && exam && (
          <Button variant="destructive" onClick={onDelete} disabled={deleting}>
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        )}
      </div>
    </div>
  );
}
