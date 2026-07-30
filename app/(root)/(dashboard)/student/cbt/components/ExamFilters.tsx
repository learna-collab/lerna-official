"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ExamAttemptStatus } from "@/app/types/cbt";

interface ExamFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: ExamAttemptStatus | "ALL";
  onStatusChange: (value: ExamAttemptStatus | "ALL") => void;
}

export function ExamFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: ExamFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          placeholder="Search examinations..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="w-full md:w-56">
        <Select
          value={status}
          onValueChange={(value) =>
            onStatusChange(value as ExamAttemptStatus | "ALL")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Exams</SelectItem>

            <SelectItem value="NOT_STARTED">Not Started</SelectItem>

            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>

            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
