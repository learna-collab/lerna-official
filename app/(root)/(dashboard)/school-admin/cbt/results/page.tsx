/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { BarChart3, Loader2, RefreshCcw } from "lucide-react";

import { toast } from "sonner";

import { CBTService } from "@/app/services/cbt.service";

import type {
  CBTResultsDashboardItem,
  CBTResultsDashboardStats,
} from "@/app/types/cbt";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ResultsDashboardStats from "./components/ResultsDashboardStats";

import ResultsDashboardFilters from "./components/ResultsDashboardFilters";

import ResultsDashboardTable from "./components/ResultsDashboardTable";

export default function ResultsDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [results, setResults] = useState<CBTResultsDashboardItem[]>([]);

  const [stats, setStats] = useState<CBTResultsDashboardStats | null>(null);

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState<
    "title" | "attempts" | "average" | "pass_rate"
  >("title");

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const loadResults = useCallback(async () => {
    try {
      setLoading(true);

      const response = await CBTService.getResultsDashboard();

      if (!response.success || !response.data) {
        toast.error(response.message);

        return;
      }

      setResults(response.data.results);

      setStats(response.data.stats);
    } catch {
      toast.error("Failed to load CBT results dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => loadResults());
  }, [loadResults]);

  async function refreshResults() {
    try {
      setRefreshing(true);

      await loadResults();
    } finally {
      setRefreshing(false);
    }
  }

  const filteredResults = useMemo(() => {
    let filtered = [...results];

    if (search.trim()) {
      const query = search.toLowerCase();

      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.class_name.toLowerCase().includes(query) ||
          item.subject_name.toLowerCase().includes(query),
      );
    }

    filtered.sort((a, b) => {
      let first: any;
      let second: any;

      switch (sortBy) {
        case "attempts":
          first = a.attempts;

          second = b.attempts;

          break;

        case "average":
          first = a.average_percentage;

          second = b.average_percentage;

          break;

        case "pass_rate":
          first = a.pass_rate;

          second = b.pass_rate;

          break;

        default:
          first = a.title.toLowerCase();

          second = b.title.toLowerCase();
      }

      if (first < second) return sortDirection === "asc" ? -1 : 1;

      if (first > second) return sortDirection === "asc" ? 1 : -1;

      return 0;
    });

    return filtered;
  }, [results, search, sortBy, sortDirection]);

  function handleSort(value: "title" | "attempts" | "average" | "pass_rate") {
    if (sortBy === value) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(value);

      setSortDirection("asc");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />

            <h1 className="text-3xl font-bold tracking-tight">
              CBT Results Dashboard
            </h1>
          </div>

          <p className="mt-2 text-muted-foreground">
            Monitor examination performance, student participation and academic
            outcomes.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={refreshResults}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* STATS */}

      {stats && <ResultsDashboardStats stats={stats} />}

      {/* FILTERS */}

      <Card>
        <CardHeader>
          <CardTitle>Examination Results</CardTitle>

          <CardDescription>
            Search, filter and analyze CBT examinations.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ResultsDashboardFilters
            search={search}
            setSearch={setSearch}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </CardContent>
      </Card>

      {/* TABLE */}

      {loading ? (
        <Card>
          <CardContent
            className="
              flex
              h-64
              items-center
              justify-center
              "
          >
            <Loader2
              className="
                h-8
                w-8
                animate-spin
                text-primary
                "
            />
          </CardContent>
        </Card>
      ) : (
        <ResultsDashboardTable
          results={filteredResults}
          onViewExam={(exam) => {
            router.push(`/school-admin/cbt/exams/${exam.exam_id}/results`);
          }}
        />
      )}
    </div>
  );
}
