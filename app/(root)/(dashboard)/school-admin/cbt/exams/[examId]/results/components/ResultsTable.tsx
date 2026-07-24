"use client";

import { Attempt } from "@/app/types/cbt";

import ResultCard from "./ResultCard";
import ResultsTableRow from "./ResultsTableRow";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ResultsTableProps {
  attempts: Attempt[];
  onViewAttempt: (attempt: Attempt) => void;
}

export default function ResultsTable({
  attempts,
  onViewAttempt,
}: ResultsTableProps) {
  if (attempts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
        <h3 className="text-lg font-semibold">No Results Found</h3>

        <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
          No student attempts match the current filters or no students have
          submitted this examination yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ===================================================== */}
      {/* Desktop Table */}
      {/* ===================================================== */}

      <div className="hidden overflow-hidden rounded-xl border lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[260px]">Student</TableHead>

              <TableHead className="w-[120px]">Answered</TableHead>

              <TableHead className="min-w-[220px]">Score</TableHead>

              <TableHead className="w-[120px]">Status</TableHead>

              <TableHead className="min-w-[180px]">Submitted</TableHead>

              <TableHead className="w-30 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {attempts.map((attempt) => (
              <ResultsTableRow
                key={attempt.id}
                attempt={attempt}
                onView={() => onViewAttempt(attempt)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ===================================================== */}
      {/* Mobile Cards */}
      {/* ===================================================== */}

      <div className="grid gap-4 lg:hidden">
        {attempts.map((attempt) => (
          <ResultCard
            key={attempt.id}
            attempt={attempt}
            onView={() => onViewAttempt(attempt)}
          />
        ))}
      </div>
    </>
  );
}
