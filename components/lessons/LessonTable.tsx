"use client";

import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

export interface LessonTableItem {
  id: string;
  week_number: number;
  class_name: string;
  subject_name: string;
  topic: string;
  title: string;
}

interface LessonTableProps {
  lessons: LessonTableItem[];
  basePath: string;
  onDelete?: (lesson: LessonTableItem) => void;
  deletingId?: string | null;
}

export function LessonTable({
  lessons,
  basePath,
  onDelete,
  deletingId = null,
}: LessonTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table className="min-w-full">
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-muted/50">
            <TableHead className="w-[100px] font-semibold">Week</TableHead>

            <TableHead className="w-[180px] font-semibold">Subject</TableHead>

            <TableHead className="font-semibold">Topic</TableHead>

            <TableHead className="font-semibold">Title</TableHead>

            <TableHead className="text-right font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {lessons.map((lesson) => {
            const isDeleting = deletingId === lesson.id;

            return (
              <TableRow
                key={lesson.id}
                className="transition-colors hover:bg-muted/30"
              >
                <TableCell className="font-medium text-foreground">
                  Week {lesson.week_number}
                </TableCell>

                <TableCell className="max-w-[180px] truncate text-foreground">
                  {lesson.subject_name}
                </TableCell>

                <TableCell className="max-w-[260px] truncate text-foreground">
                  {lesson.topic}
                </TableCell>

                <TableCell className="max-w-[320px] truncate text-foreground">
                  {lesson.title}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="gap-1 rounded-lg"
                    >
                      <Link href={`${basePath}/${lesson.id}`}>
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="gap-1 rounded-lg"
                      disabled={isDeleting}
                      onClick={() => onDelete?.(lesson)}
                    >
                      <Trash2 className="h-4 w-4" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
