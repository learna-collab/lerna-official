"use client";

import { ArrowUpDown, ExternalLink, Search, Trophy } from "lucide-react";

import type { StudentHistoryItem } from "@/app/types/cbt";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PassFailBadge from "../../result/components/PassFailBadge";

interface HistoryTableProps {
  history: StudentHistoryItem[];

  search: string;

  onSearchChange: (value: string) => void;

  onViewResult: (attemptId: string) => void;

  sortAscending?: boolean;

  onToggleSort?: () => void;
}

export default function HistoryTable({
  history,
  search,
  onSearchChange,
  onViewResult,
  sortAscending = false,
  onToggleSort,
}: HistoryTableProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-6 p-6">
        {/* Toolbar */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by exam or subject..."
              className="pl-10"
            />
          </div>

          <Button variant="outline" onClick={onToggleSort}>
            <ArrowUpDown className="mr-2 h-4 w-4" />

            {sortAscending ? "Oldest First" : "Newest First"}
          </Button>
        </div>

        {/* Empty State */}

        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Trophy className="mb-4 h-14 w-14 text-muted-foreground" />

            <h3 className="text-xl font-semibold">No Examination History</h3>

            <p className="mt-2 max-w-md text-muted-foreground">
              Your completed examinations will appear here after you submit
              them.
            </p>
          </div>
        )}

        {/* Table */}

        {history.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam</TableHead>

                  <TableHead>Subject</TableHead>

                  <TableHead className="text-center">Score</TableHead>

                  <TableHead className="text-center">Percentage</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead>Completed</TableHead>

                  <TableHead className="w-30">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.attempt_id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.exam_title}</p>

                        <p className="text-xs text-muted-foreground">
                          {item.exam_id}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>{item.subject_name}</TableCell>

                    <TableCell className="text-center font-semibold">
                      {item.score}
                    </TableCell>

                    <TableCell className="text-center">
                      {item.percentage.toFixed(1)}%
                    </TableCell>

                    <TableCell>
                      <PassFailBadge passed={item.passed} />
                    </TableCell>

                    <TableCell>
                      {item.completed_at
                        ? new Date(item.completed_at).toLocaleString()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewResult(item.attempt_id)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
