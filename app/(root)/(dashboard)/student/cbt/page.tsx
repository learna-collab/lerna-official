/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck } from "lucide-react";

import type { ExamAttemptStatus, StudentExam } from "@/app/types/cbt";

import { ExamFilters } from "./components/ExamFilters";
import { ExamGrid } from "./components/ExamGrid";
import { EmptyState } from "./components/EmptyState";
import { LoadingSkeleton } from "./components/LoadingSkeleton";

import { Card } from "@/components/ui/card";
import { CBTService } from "@/app/services/cbt.service";
import { toast } from "sonner";

export default function StudentCBTPage() {
  const [loading, setLoading] = useState(true);

  const [exams, setExams] = useState<StudentExam[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<ExamAttemptStatus | "ALL">("ALL");

  async function loadExams() {
    try {
      setLoading(true);

      const response = await CBTService.getAvailableExams();

      setExams(response.data?.exams ?? []);
    } catch (error: any) {
      console.log(error?.response?.data?.detail);
      toast.error("Failed to load examinations");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    Promise.resolve().then(() => loadExams());
  }, []);

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchesSearch =
        exam.title.toLowerCase().includes(search.toLowerCase()) ||
        exam.subject_name.toLowerCase().includes(search.toLowerCase()) ||
        exam.class_name.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "ALL" || exam.attempt_status === status;

      return matchesSearch && matchesStatus;
    });
  }, [exams, search, status]);

  return (
    <div className="space-y-6 p-10">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <BookOpenCheck className="h-8 w-8 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Computer Based Tests</h1>

            <p className="text-muted-foreground">
              View, start and continue your examinations.
            </p>
          </div>
        </div>
      </Card>

      <ExamFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      {loading ? (
        <LoadingSkeleton />
      ) : filteredExams.length === 0 ? (
        <EmptyState />
      ) : (
        <ExamGrid exams={filteredExams} />
      )}
    </div>
  );
}
