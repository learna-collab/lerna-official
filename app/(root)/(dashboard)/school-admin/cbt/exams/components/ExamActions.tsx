"use client";

import Link from "next/link";

import {
  CheckCircle2,
  Eye,
  Loader2,
  MoreVertical,
  Pencil,
  Trash2,
  Trophy,
} from "lucide-react";

import { Exam } from "@/app/types/cbt";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExamActionsProps {
  exam: Exam;

  publishing?: boolean;

  deleting?: boolean;

  onPublish?: () => void;

  onDelete?: () => void;
}

export default function ExamActions({
  exam,
  publishing = false,
  deleting = false,
  onPublish,
  onDelete,
}: ExamActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href={`/school-admin/cbt/exams/${exam.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Examination
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/school-admin/cbt/exams/${exam.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Examination
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/school-admin/cbt/exams/${exam.id}/questions`}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Manage Questions
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/school-admin/cbt/exams/${exam.id}/results`}>
            <Trophy className="mr-2 h-4 w-4" />
            View Results
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {!exam.is_published && onPublish && (
          <DropdownMenuItem disabled={publishing} onClick={onPublish}>
            {publishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                Publish Examination
              </>
            )}
          </DropdownMenuItem>
        )}

        {onDelete && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={deleting}
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Examination
                </>
              )}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
