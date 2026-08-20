"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
  SuperAdminLessonService,
  LessonResponse,
} from "@/app/services/super-admin-lesson.service";

import { LessonFilters } from "@/components/lessons/LessonFilters";
import { LessonTable } from "@/components/lessons/LessonTable";
import { LessonEmptyState } from "@/components/lessons/LessonEmptyState";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SuperAdminLessonsPage() {
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);

  const [weekNumber, setWeekNumber] = useState("");

  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [sessions, setSessions] = useState<{ id: string; name: string }[]>([]);
  const [terms, setTerms] = useState<{ id: string; name: string }[]>([]);

  const [classId, setClassId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [termId, setTermId] = useState("");

  // =========================================================
  // LOAD FILTERS
  // =========================================================

  async function loadFilters() {
    try {
      setLoadingFilters(true);

      const [classData, sessionData, termData] = await Promise.all([
        SuperAdminLessonService.getClasses(),
        SuperAdminLessonService.getSessions(),
        SuperAdminLessonService.getTerms(),
      ]);

      setClasses(classData);
      setSessions(sessionData);
      setTerms(termData);

      if (classData.length > 0) setClassId(classData[0].id);
      if (sessionData.length > 0) setSessionId(sessionData[0].id);
      if (termData.length > 0) setTermId(termData[0].id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load filters.");
    } finally {
      setLoadingFilters(false);
    }
  }

  // =========================================================
  // LOAD LESSONS
  // =========================================================

  async function loadLessons(selectedWeek?: number) {
    if (!classId || !sessionId || !termId) return;

    try {
      setLoading(true);

      const data = await SuperAdminLessonService.getLessons({
        classTemplateId: classId,

        sessionId,
        termId,
        weekNumber: selectedWeek,
      });

      setLessons(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail ?? "Failed to load lessons.");
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    void Promise.resolve().then(() => loadFilters());
  }, []);

  // =========================================================
  // RELOAD WHEN FILTERS CHANGE
  // =========================================================

  useEffect(() => {
    if (classId && sessionId && termId) {
      void Promise.resolve().then(() => loadLessons());
    }
  }, [classId, sessionId, termId]);

  function handleApplyFilter() {
    if (!weekNumber) {
      void loadLessons();
      return;
    }

    void loadLessons(Number(weekNumber));
  }

  function handleResetFilter() {
    setWeekNumber("");
    void loadLessons();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lesson Notes</h1>

          <p className="mt-1 text-muted-foreground">
            Upload, review, and manage ALF lesson notes.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/lessons/upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload Lesson
          </Link>
        </Button>
      </div>

      {/* Filters */}

      <div className="grid gap-4 md:grid-cols-3">
        {/* Class */}

        <div className="space-y-2">
          <Label>Class</Label>

          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>

            <SelectContent>
              {classes.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Session */}

        <div className="space-y-2">
          <Label>Session</Label>

          <Select value={sessionId} onValueChange={setSessionId}>
            <SelectTrigger>
              <SelectValue placeholder="Select session" />
            </SelectTrigger>

            <SelectContent>
              {sessions.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Term */}

        <div className="space-y-2">
          <Label>Term</Label>

          <Select value={termId} onValueChange={setTermId}>
            <SelectTrigger>
              <SelectValue placeholder="Select term" />
            </SelectTrigger>

            <SelectContent>
              {terms.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Week Filter */}

      <LessonFilters
        weekNumber={weekNumber}
        onWeekNumberChange={setWeekNumber}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />

      {/* Content */}

      {loading || loadingFilters ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : lessons.length === 0 ? (
        <LessonEmptyState
          title="No lesson notes uploaded yet"
          description="Upload your first daily lesson note to get started."
        />
      ) : (
        <LessonTable
          lessons={lessons.map((lesson) => ({
            id: lesson.id,
            week_number: lesson.week_number,
            class_name: lesson.class_name,
            subject_name: lesson.subject_name,
            topic: lesson.topic,
            title: lesson.title,
          }))}
          basePath="/admin/lessons"
        />
      )}
    </div>
  );
}
