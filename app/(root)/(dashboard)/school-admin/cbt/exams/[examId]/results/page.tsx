"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ArrowLeft, ArrowUpDown, Search } from "lucide-react";

import { toast } from "sonner";

import { CBTService } from "@/app/services/cbt.service";

import { Attempt, Exam } from "@/app/types/cbt";

import AttemptDetailsDialog from "./components/AttemptDetailsDialog";
import ResultsStats from "./components/ResultsStats";
import ResultsTable from "./components/ResultsTable";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";

type SortOption = "name" | "score" | "percentage" | "submitted";

export default function ExamResultsPage() {
  const { examId } = useParams<{
    examId: string;
  }>();

  const [loading, setLoading] = useState(true);

  const [exam, setExam] = useState<Exam | null>(null);

  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState<SortOption>("score");

  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);

      const [examResponse, resultsResponse] = await Promise.all([
        CBTService.getExam(examId),
        CBTService.getExamResults(examId),
      ]);

      if (!examResponse.success || !examResponse.data) {
        toast.error(examResponse.message ?? "Unable to load examination.");

        return;
      }

      if (!resultsResponse.success || !resultsResponse.data) {
        toast.error(resultsResponse.message ?? "Unable to load results.");

        return;
      }

      setExam(examResponse.data);
      console.log("examresponse:================", examResponse.data);
      console.log("resultresponse:================", resultsResponse.data);

      setAttempts(resultsResponse.data.attempts ?? []);
    } catch {
      toast.error("Failed to load examination results.");
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    void Promise.resolve().then(() => loadPage());
  }, [loadPage]);

  const filteredAttempts = useMemo(() => {
    let data = [...attempts];

    if (search.trim()) {
      const query = search.toLowerCase();

      data = data.filter((attempt) => {
        const fullName = `${attempt.student?.first_name ?? ""} ${
          attempt.student?.last_name ?? ""
        }`.toLowerCase();

        const admission =
          attempt.student?.admission_number?.toLowerCase() ?? "";

        return fullName.includes(query) || admission.includes(query);
      });
    }

    switch (sortBy) {
      case "name":
        data.sort((a, b) => {
          const nameA = `${a.student?.first_name ?? ""} ${
            a.student?.last_name ?? ""
          }`;

          const nameB = `${b.student?.first_name ?? ""} ${
            b.student?.last_name ?? ""
          }`;

          return nameA.localeCompare(nameB);
        });
        break;

      case "score":
        data.sort((a, b) => b.score - a.score);
        break;

      case "percentage":
        data.sort((a, b) => b.percentage - a.percentage);
        break;

      case "submitted":
        data.sort((a, b) => {
          const timeA = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;

          const timeB = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;

          return timeB - timeA;
        });
        break;
    }

    return data;
  }, [attempts, search, sortBy]);

  const stats = useMemo(() => {
    const totalAttempts = attempts.length;

    const passed = attempts.filter((attempt) => attempt.is_passed).length;

    const failed = totalAttempts - passed;

    const averagePercentage =
      totalAttempts === 0
        ? 0
        : attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) /
          totalAttempts;

    return {
      totalAttempts,
      passed,
      failed,
      averagePercentage,
    };
  }, [attempts]);

  function openAttempt(attempt: Attempt) {
    setSelectedAttempt(attempt);

    setDialogOpen(true);
  }

  console.log(stats);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-10">
      {/* ============================================== */}
      {/* Header */}
      {/* ============================================== */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Button asChild variant="ghost" className="mb-4 px-0">
            <Link href={`/school-admin/cbt/exams/${examId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Examination
            </Link>
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">
            Examination Results
          </h1>

          <p className="mt-2 max-w-3xl text-muted-foreground">
            View student performance, rankings and examination statistics.
          </p>
        </div>

        {exam && (
          <Card className="min-w-[300px]">
            <CardHeader className="pb-3">
              <CardTitle>{exam.title}</CardTitle>

              <CardDescription>
                {exam.subject?.name} • {exam.school_class?.name}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions</span>

                <span className="font-medium">
                  {exam.question_count ?? exam.questions?.length ?? 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Marks</span>

                <span className="font-medium">{exam.total_marks}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>

                <span className="font-medium">
                  {exam.duration_minutes} mins
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      {/* ============================================== */}
      {/* Statistics */}
      {/* ============================================== */}

      <ResultsStats
        totalAttempts={stats.totalAttempts}
        passed={stats.passed}
        failed={stats.failed}
        averagePercentage={stats.averagePercentage}
      />

      {/* ============================================== */}
      {/* Search & Sort */}
      {/* ============================================== */}

      <Card>
        <CardHeader>
          <CardTitle>Student Results</CardTitle>

          <CardDescription>
            Search, sort and review examination attempts.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search by student name or admission number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-full md:w-64">
                <ArrowUpDown className="mr-2 h-4 w-4" />

                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="score">Highest Score</SelectItem>

                <SelectItem value="percentage">Highest Percentage</SelectItem>

                <SelectItem value="name">Student Name</SelectItem>

                <SelectItem value="submitted">Latest Submission</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex h-72 items-center justify-center">
              <p className="text-muted-foreground">Loading results...</p>
            </div>
          ) : (
            <ResultsTable
              attempts={filteredAttempts}
              onViewAttempt={openAttempt}
            />
          )}
        </CardContent>
      </Card>

      {/* ============================================== */}
      {/* Attempt Dialog */}
      {/* ============================================== */}

      <AttemptDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        attempt={selectedAttempt}
      />
    </div>
  );
}
