"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  SchoolAdminLessonService,
  LessonResponse,
} from "@/app/services/school-admin-lesson.service";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { useAcademicPeriod } from "@/app/hooks/use-academic-period";

import { LessonFilters } from "@/components/lessons/LessonFilters";
import { LessonTable } from "@/components/lessons/LessonTable";
import { LessonEmptyState } from "@/components/lessons/LessonEmptyState";

import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SchoolAdminLessonsPage() {
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [weekNumber, setWeekNumber] = useState("");

  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const { session, term, loading: academicLoading } = useAcademicPeriod();

  const sessionId = session?.id ?? "";
  const termId = term?.id ?? "";

  /* =========================================================
     LOAD CLASSES
  ========================================================= */

  async function loadFilters() {
    try {
      const classData = await SchoolAdminService.getClasses();

      setClasses(classData);

      if (classData.length > 0) {
        setClassId(classData[0].id);
      }
    } catch {
      toast.error("Failed to load classes.");
    }
  }

  /* =========================================================
     LOAD SUBJECTS FOR SELECTED CLASS
  ========================================================= */

  async function loadSubjectsForClass(selectedClassId: string) {
    try {
      setSubjects([]);
      setSubjectId("");

      const data = await SchoolAdminService.getClassSubjects(selectedClassId);

      // backend may return array directly or { subjects: [] }
      const classSubjects = Array.isArray(data) ? data : (data.subjects ?? []);

      setSubjects(classSubjects);

      if (classSubjects.length > 0) {
        setSubjectId(classSubjects[0].id);
      }
    } catch {
      toast.error("Failed to load subjects for selected class.");
    }
  }

  /* =========================================================
     LOAD LESSONS
  ========================================================= */

  async function loadLessons(selectedWeek?: number) {
    if (!classId || !subjectId || !sessionId || !termId) return;

    try {
      setLoading(true);

      const data = await SchoolAdminLessonService.getLessons({
        classId,
        subjectId,
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

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    void Promise.resolve().then(() => loadFilters());
  }, []);

  /* =========================================================
     WHEN CLASS CHANGES -> LOAD SUBJECTS
  ========================================================= */

  useEffect(() => {
    if (classId) {
      void Promise.resolve().then(() => loadSubjectsForClass(classId));
    }
  }, [classId]);

  /* =========================================================
     WHEN FILTERS CHANGE -> LOAD LESSONS
  ========================================================= */

  useEffect(() => {
    if (!academicLoading && sessionId && termId && classId && subjectId) {
      void Promise.resolve().then(() => loadLessons());
    }
  }, [academicLoading, sessionId, termId, classId, subjectId]);

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lesson Notes</h1>

        <p className="text-muted-foreground mt-1">
          Browse published lesson notes for classes and subjects in your school.
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2">
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

        <div className="space-y-2">
          <Label>Subject</Label>

          <Select
            value={subjectId}
            onValueChange={setSubjectId}
            disabled={!classId || subjects.length === 0}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  classId
                    ? subjects.length
                      ? "Select subject"
                      : "No subjects assigned"
                    : "Select class first"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {subjects.map((item) => (
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
      {loading || academicLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : lessons.length === 0 ? (
        <LessonEmptyState
          title="No lessons found"
          description="No lesson notes are available for the selected filters."
        />
      ) : (
        <LessonTable
          lessons={lessons.map((lesson) => ({
            id: lesson.id,
            week_number: lesson.week_number,
            lesson_day: lesson.lesson_day,
            class_name: lesson.class_name,
            subject_name: lesson.subject_name,
            topic: lesson.topic,
            title: lesson.title,
          }))}
          basePath="/school-admin/lessons"
        />
      )}
    </div>
  );
}
