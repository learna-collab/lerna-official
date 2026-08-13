import Link from "next/link";
import { Eye } from "lucide-react";

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
}

export function LessonTable({ lessons, basePath }: LessonTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table className="min-w-full">
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-muted/50">
            <TableHead className="w-[120px] font-semibold">Week</TableHead>

            <TableHead className="font-semibold">Topic</TableHead>

            <TableHead className="font-semibold">Title</TableHead>

            <TableHead className="text-right font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {lessons.map((lesson) => (
            <TableRow
              key={lesson.id}
              className="transition-colors hover:bg-muted/30"
            >
              <TableCell className="font-medium text-foreground">
                Week {lesson.week_number}
              </TableCell>

              <TableCell className="max-w-[260px] truncate text-foreground">
                {lesson.topic}
              </TableCell>

              <TableCell className="max-w-[320px] truncate text-foreground">
                {lesson.title}
              </TableCell>

              <TableCell className="text-right">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
