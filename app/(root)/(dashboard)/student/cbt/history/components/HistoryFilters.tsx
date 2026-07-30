"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type HistoryStatusFilter = "ALL" | "PASSED" | "FAILED";

export type HistorySort =
  | "NEWEST"
  | "OLDEST"
  | "HIGHEST_SCORE"
  | "LOWEST_SCORE";

interface HistoryFiltersProps {
  search: string;
  status: HistoryStatusFilter;
  sort: HistorySort;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: HistoryStatusFilter) => void;
  onSortChange: (value: HistorySort) => void;
  onReset?: () => void;
}

export default function HistoryFilters({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onReset,
}: HistoryFiltersProps) {
  const hasFilters =
    search.trim().length > 0 || status !== "ALL" || sort !== "NEWEST";

  return (
    <div className="space-y-4 rounded-xl border bg-background p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-primary" />

        <h2 className="font-semibold">Filter Results</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px_auto]">
        {/* Search */}

        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

          <Input
            value={search}
            placeholder="Search exam or subject..."
            className="pl-10"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Status */}

        <Select
          value={status}
          onValueChange={(value) =>
            onStatusChange(value as HistoryStatusFilter)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Results</SelectItem>

            <SelectItem value="PASSED">Passed</SelectItem>

            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}

        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as HistorySort)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="NEWEST">Newest First</SelectItem>

            <SelectItem value="OLDEST">Oldest First</SelectItem>

            <SelectItem value="HIGHEST_SCORE">Highest Score</SelectItem>

            <SelectItem value="LOWEST_SCORE">Lowest Score</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset */}

        <Button variant="outline" disabled={!hasFilters} onClick={onReset}>
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
