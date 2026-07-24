"use client";

import { Search, SlidersHorizontal, ArrowDownUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

interface ResultsDashboardFiltersProps {
  search: string;

  setSearch: (value: string) => void;

  sortBy: "title" | "attempts" | "average" | "pass_rate";

  sortDirection: "asc" | "desc";

  onSort: (value: "title" | "attempts" | "average" | "pass_rate") => void;
}

export default function ResultsDashboardFilters({
  search,

  setSearch,

  sortBy,

  sortDirection,

  onSort,
}: ResultsDashboardFiltersProps) {
  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        {/* Header */}

        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-5 w-5 text-primary" />

          <div>
            <h3 className="font-semibold">Filter Results</h3>

            <p className="text-sm text-muted-foreground">
              Search and sort CBT examination results.
            </p>
          </div>
        </div>

        <div
          className="
          grid
          gap-4
          md:grid-cols-3
          "
        >
          {/* Search */}

          <div className="relative md:col-span-2">
            <Search
              className="
              absolute
              left-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-muted-foreground
              "
            />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="
              Search exam, class or subject...
              "
              className="pl-10"
            />
          </div>

          {/* Sort */}

          <Select
            value={sortBy}
            onValueChange={(value) => {
              onSort(value as "title" | "attempts" | "average" | "pass_rate");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort Results" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="title">Alphabetical</SelectItem>

              <SelectItem value="attempts">Number of Attempts</SelectItem>

              <SelectItem value="average">Average Score</SelectItem>

              <SelectItem value="pass_rate">Pass Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sorting direction */}

        <div
          className="
          flex
          items-center
          justify-between
          rounded-lg
          border
          p-3
          "
        >
          <div
            className="
            flex
            items-center
            gap-2
            text-sm
            text-muted-foreground
            "
          >
            <ArrowDownUp className="h-4 w-4" />
            Sort Direction
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onSort(sortBy);
            }}
          >
            {sortDirection === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>

        {/* Reset */}

        <Button
          variant="ghost"
          className="w-full"
          onClick={() => {
            setSearch("");

            onSort("title");
          }}
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
