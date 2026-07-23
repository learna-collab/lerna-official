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

interface ExamFiltersProps {
  search: string;

  status: string;

  onSearchChange: (value: string) => void;

  onStatusChange: (value: string) => void;

  onReset?: () => void;
}

export default function ExamFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onReset,
}: ExamFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search examinations..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-3">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[190px]">
            <SlidersHorizontal className="mr-2 h-4 w-4" />

            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Examinations</SelectItem>

            <SelectItem value="draft">Draft</SelectItem>

            <SelectItem value="published">Published</SelectItem>

            <SelectItem value="scheduled">Scheduled</SelectItem>

            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={onReset}>
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
