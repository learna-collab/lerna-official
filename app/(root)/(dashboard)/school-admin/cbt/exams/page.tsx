/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { toast } from "sonner";

import { Plus, Search, FileText, CheckCircle2, Clock3 } from "lucide-react";

import { CBTService } from "@/app/services/cbt.service";

import { Exam } from "@/app/types/cbt";

import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ExamCard } from "./components/ExamCard";

import { ExamStats } from "./components/ExamStats";

export default function ExamsPage() {
  const [loading, setLoading] = useState(true);

  const [exams, setExams] = useState<Exam[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  async function loadExams() {
    try {
      setLoading(true);

      const response = await CBTService.getSchoolExams();

      setExams(response.data?.exams ?? []);
    } catch (error: any) {
      console.log(error?.response?.data);

      toast.error("Failed to load examinations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadExams());
  }, []);

  const filteredExams = useMemo(() => {
    let data = [...exams];

    if (status === "published") {
      data = data.filter((exam) => exam.is_published);
    }

    if (status === "draft") {
      data = data.filter((exam) => !exam.is_published);
    }

    if (search.trim()) {
      data = data.filter((exam) =>
        exam.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return data;
  }, [exams, search, status]);

  const stats = useMemo(() => {
    return {
      total: exams.length,

      published: exams.filter((exam) => exam.is_published).length,

      drafts: exams.filter((exam) => !exam.is_published).length,

      questions: exams.reduce(
        (sum, exam) => sum + (exam.question_count ?? 0),
        0,
      ),
    };
  }, [exams]);
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8">
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Examination Management
          </h1>

          <p className="mt-2 text-muted-foreground">
            Create, manage and publish Computer Based Tests for your students.
          </p>
        </div>

        <Button asChild>
          <Link href="/school-admin/cbt/exams/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Examination
          </Link>
        </Button>
      </div>

      {/* ====================================================== */}
      {/* STATS */}
      {/* ====================================================== */}

      <ExamStats
        total={stats.total}
        published={stats.published}
        drafts={stats.drafts}
        questions={stats.questions}
      />

      {/* ====================================================== */}
      {/* FILTERS */}
      {/* ====================================================== */}

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search examinations..."
              className="pl-10"
            />
          </div>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full lg:w-52">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>

              <SelectItem value="published">Published</SelectItem>

              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* ====================================================== */}
      {/* EXAMS */}
      {/* ====================================================== */}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-72 animate-pulse" />
          ))}
        </div>
      ) : filteredExams.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20">
          <FileText className="mb-5 h-14 w-14 text-muted-foreground" />

          <h3 className="text-xl font-semibold">No examinations found</h3>

          <p className="mt-2 max-w-md text-center text-muted-foreground">
            {search || status !== "all"
              ? "No examination matches the selected filter."
              : "Create your first CBT examination to begin assessing students."}
          </p>

          {!search && status === "all" && (
            <Button asChild className="mt-6">
              <Link href="/school-admin/cbt/exams/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Examination
              </Link>
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} onRefresh={loadExams} />
          ))}
        </div>
      )}
    </div>
  );
}
