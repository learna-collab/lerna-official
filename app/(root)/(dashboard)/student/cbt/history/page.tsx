"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

import type {
  HistorySort,
  HistoryStatusFilter,
} from "./components/HistoryFilters";

import type { StudentHistoryItem } from "@/app/types/cbt";

import EmptyHistory from "./components/EmptyHistory";
import HistoryCard from "./components/HistoryCard";
import HistoryFilters from "./components/HistoryFilters";
import HistoryTable from "./components/HistoryTable";

import { Button } from "@/components/ui/button";
import { CBTService } from "@/app/services/cbt.service";

export default function StudentHistoryPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [history, setHistory] = useState<StudentHistoryItem[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<HistoryStatusFilter>("ALL");

  const [sort, setSort] = useState<HistorySort>("NEWEST");

  async function loadHistory() {
    try {
      setLoading(true);

      const response = await CBTService.getStudentHistory();

      setHistory(response.data?.attempts ?? []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadHistory();
  }, []);
  const filteredHistory = useMemo(() => {
    let data = [...history];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (item) =>
          item.exam_title.toLowerCase().includes(keyword) ||
          item.subject_name.toLowerCase().includes(keyword),
      );
    }

    if (status === "PASSED") {
      data = data.filter((x) => x.passed);
    }

    if (status === "FAILED") {
      data = data.filter((x) => !x.passed);
    }

    switch (sort) {
      case "NEWEST":
        data.sort(
          (a, b) =>
            new Date(b.completed_at ?? "").getTime() -
            new Date(a.completed_at ?? "").getTime(),
        );
        break;

      case "OLDEST":
        data.sort(
          (a, b) =>
            new Date(a.completed_at ?? "").getTime() -
            new Date(b.completed_at ?? "").getTime(),
        );
        break;

      case "HIGHEST_SCORE":
        data.sort((a, b) => b.score - a.score);
        break;

      case "LOWEST_SCORE":
        data.sort((a, b) => a.score - b.score);
        break;
    }

    return data;
  }, [history, search, status, sort]);

  function resetFilters() {
    setSearch("");
    setStatus("ALL");
    setSort("NEWEST");
  }

  function openResult(attemptId: string) {
    router.push(`/student/cbt/result/${attemptId}`);
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Examination History</h1>

          <p className="text-muted-foreground">
            View all completed CBT examinations and results.
          </p>
        </div>

        <Button onClick={() => router.push("/student/cbt")}>
          Browse Exams
        </Button>
      </div>

      {history.length === 0 ? (
        <EmptyHistory onBrowseExams={() => router.push("/student/cbt")} />
      ) : (
        <>
          <HistoryFilters
            search={search}
            status={status}
            sort={sort}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onSortChange={setSort}
            onReset={resetFilters}
          />

          {/* Desktop */}

          <div className="hidden lg:block">
            <HistoryTable
              history={filteredHistory}
              search={search}
              onSearchChange={setSearch}
              sortAscending={sort === "OLDEST"}
              onToggleSort={() =>
                setSort((prev) => (prev === "NEWEST" ? "OLDEST" : "NEWEST"))
              }
              onViewResult={openResult}
            />
          </div>

          {/* Mobile */}

          <div className="grid gap-6 lg:hidden">
            {filteredHistory.map((item) => (
              <HistoryCard
                key={item.attempt_id}
                item={item}
                onViewResult={openResult}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
