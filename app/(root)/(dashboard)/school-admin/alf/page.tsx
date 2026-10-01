"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AlertCircle, BookOpenCheck, RefreshCw } from "lucide-react";

import { toast } from "sonner";

import { ALFStatsCards } from "./components/alf-stats-cards";
import { ALFFilters } from "./components/alf-filters";
import { ALFUsageTable } from "./components/alf-usage-table";
import { ALFSessionDetailDialog } from "./components/alf-session-detail-dialog";

import {
  alfService,
  type ALFSessionStatus,
  type ALFUsageSession,
  type ALFUsageStats,
} from "@/app/services/alf.service";

import {
  SchoolAdminService,
  type TeacherItem,
} from "@/app/services/school-admin.service";

const EMPTY_STATS: ALFUsageStats = {
  total_sessions: 0,
  completed_sessions: 0,
  in_progress_sessions: 0,
  started_sessions: 0,
  abandoned_sessions: 0,
  total_duration_seconds: 0,
  average_duration_seconds: 0,
  completion_rate: 0,
};

interface ClassItem {
  id: string;
  name: string;
}

export default function SchoolAdminALFPage() {
  // =========================================================
  // ALF DATA
  // =========================================================

  const [stats, setStats] = useState<ALFUsageStats>(EMPTY_STATS);
  const [sessions, setSessions] = useState<ALFUsageSession[]>([]);

  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);

  // =========================================================
  // UI STATE
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================================================
  // FILTER STATE
  // =========================================================

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ALFSessionStatus | "ALL">("ALL");
  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");

  // =========================================================
  // DETAIL DIALOG
  // =========================================================

  const [selectedSession, setSelectedSession] =
    useState<ALFUsageSession | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);

  // =========================================================
  // LOAD ALF DASHBOARD
  // =========================================================

  const loadDashboard = useCallback(async (showRefreshState = false) => {
    try {
      setError(null);

      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [statsData, usageData] = await Promise.all([
        alfService.getStats(),
        alfService.getUsage(),
      ]);

      setStats(statsData);
      setSessions(usageData);
    } catch (err) {
      console.error("Failed to load ALF dashboard:", err);

      setError("Unable to load ALF usage data. Please try again.");

      toast.error("Failed to load ALF dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // =========================================================
  // LOAD FILTER OPTIONS
  // =========================================================

  const loadFilterOptions = useCallback(async () => {
    try {
      const [classesData, teachersData] = await Promise.all([
        SchoolAdminService.getClasses(),
        SchoolAdminService.getSchoolTeachers(),
      ]);

      setClasses(classesData);
      setTeachers(teachersData.teachers);
    } catch (err) {
      console.error("Failed to load ALF filter options:", err);

      toast.error("Failed to load filter options");
    }
  }, []);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    void Promise.resolve().then(() =>
      Promise.all([loadDashboard(), loadFilterOptions()]),
    );
  }, [loadDashboard, loadFilterOptions]);

  // =========================================================
  // FILTER SESSIONS
  // =========================================================

  const filteredSessions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return sessions.filter((session) => {
      // -----------------------------------------------
      // Search
      // -----------------------------------------------

      const matchesSearch =
        !normalizedSearch ||
        session.teacher_name.toLowerCase().includes(normalizedSearch) ||
        session.lesson_title.toLowerCase().includes(normalizedSearch) ||
        session.subject_name.toLowerCase().includes(normalizedSearch) ||
        session.class_name.toLowerCase().includes(normalizedSearch);

      // -----------------------------------------------
      // Status
      // -----------------------------------------------

      const matchesStatus = status === "ALL" || session.status === status;

      // -----------------------------------------------
      // Class
      // -----------------------------------------------

      const matchesClass = !classId || session.class_id === classId;

      // -----------------------------------------------
      // Teacher
      // -----------------------------------------------

      const matchesTeacher = !teacherId || session.teacher_id === teacherId;

      return matchesSearch && matchesStatus && matchesClass && matchesTeacher;
    });
  }, [sessions, search, status, classId, teacherId]);

  // =========================================================
  // RESET FILTERS
  // =========================================================

  const resetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setClassId("");
    setTeacherId("");
  };

  // =========================================================
  // SELECT SESSION
  // =========================================================

  const handleSelectSession = (session: ALFUsageSession) => {
    setSelectedSession(session);
    setDetailOpen(true);
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-56 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl border bg-muted/40"
            />
          ))}
        </div>

        <div className="h-20 animate-pulse rounded-xl border bg-muted/40" />

        <div className="h-[420px] animate-pulse rounded-xl border bg-muted/40" />
      </div>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">ALF Usage</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor how teachers are using ALF lessons across your school.
          </p>
        </div>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />

            <div>
              <h2 className="font-medium">Unable to load dashboard</h2>

              <p className="mt-1 text-sm text-muted-foreground">{error}</p>

              <button
                type="button"
                onClick={() => loadDashboard()}
                className="mt-4 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="space-y-6 pb-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BookOpenCheck className="h-6 w-6" />

            <h1 className="text-2xl font-semibold tracking-tight">ALF Usage</h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor how teachers are using ALF lessons across your school.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <ALFStatsCards stats={stats} />

      {/* =====================================================
          SESSION ACTIVITY
      ===================================================== */}

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Session Activity</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Review individual teacher sessions and completion progress.
          </p>
        </div>

        {/* ===================================================
            FILTERS
        =================================================== */}

        <ALFFilters
          classes={classes}
          teachers={teachers}
          search={search}
          status={status}
          classId={classId}
          teacherId={teacherId}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onClassChange={setClassId}
          onTeacherChange={setTeacherId}
          onReset={resetFilters}
        />

        {/* ===================================================
            RESULT COUNT
        =================================================== */}

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredSessions.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {sessions.length}
            </span>{" "}
            sessions
          </p>
        </div>

        {/* ===================================================
            TABLE
        =================================================== */}

        <ALFUsageTable
          sessions={filteredSessions}
          onSelect={handleSelectSession}
        />

        {/* ===================================================
            DETAIL
        =================================================== */}

        <ALFSessionDetailDialog
          session={selectedSession}
          open={detailOpen}
          onClose={() => {
            setDetailOpen(false);
            setSelectedSession(null);
          }}
        />
      </div>
    </div>
  );
}
