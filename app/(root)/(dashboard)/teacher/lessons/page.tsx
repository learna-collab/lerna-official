"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  TeacherLessonService,
  LessonResponse,
} from "@/app/services/teacher-lesson.service";
import { teacherService } from "@/app/services/teacher.service";
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

type ClassOption = {
  id: string;
  name: string;
};

export default function TeacherLessonsPage() {
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [weekNumber, setWeekNumber] = useState("");

  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [classId, setClassId] = useState("");

  const { session, term, loading: academicLoading } = useAcademicPeriod();

  const sessionId = session?.id ?? "";
  const termId = term?.id ?? "";

  // =========================================================
  // LOAD TEACHER CLASSES
  // =========================================================

  async function loadClasses() {
    try {
      const classData = await teacherService.getClasses();

      setClasses(classData);

      if (classData.length > 0) {
        setClassId(classData[0].id);
      }
    } catch (error) {
      console.error("Failed to load teacher classes:", error);
      toast.error("Failed to load classes.");
    }
  }

  // =========================================================
  // LOAD LESSONS
  // =========================================================

  async function loadLessons(selectedWeek?: number) {
    if (!classId || !sessionId || !termId) {
      return;
    }

    try {
      setLoading(true);

      const data = await TeacherLessonService.getLessons({
        classId,
        sessionId,
        termId,
        subjectId: "",
        weekNumber: selectedWeek,
      });

      setLessons(data);
    } catch (error: any) {
      console.error("Failed to load lessons:", error);

      toast.error(error?.response?.data?.detail ?? "Failed to load lessons.");
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    void Promise.resolve().then(() => loadClasses());
  }, []);

  // =========================================================
  // RELOAD WHEN CLASS / ACADEMIC PERIOD CHANGES
  // =========================================================

  useEffect(() => {
    if (!academicLoading && sessionId && termId && classId) {
      void Promise.resolve().then(() => loadLessons());
    }
  }, [academicLoading, sessionId, termId, classId]);

  // =========================================================
  // FILTER ACTIONS
  // =========================================================

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

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Lessons</h1>

        <p className="mt-1 text-muted-foreground">
          View lesson notes assigned to your classes.
        </p>
      </div>

      {/* =====================================================
          CLASS FILTER
      ===================================================== */}

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
      </div>

      {/* =====================================================
          WEEK FILTER
      ===================================================== */}

      <LessonFilters
        weekNumber={weekNumber}
        onWeekNumberChange={setWeekNumber}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      {loading || academicLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : lessons.length === 0 ? (
        <LessonEmptyState
          title="No lessons available"
          description="No lesson notes have been uploaded for the selected filters."
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
          basePath="/teacher/lessons"
          /*
           * IMPORTANT:
           *
           * The detail page needs classId to create/restore
           * the teacher's ALF session.
           */
          getViewHref={(lesson) =>
            `/teacher/lessons/${lesson.id}?classId=${encodeURIComponent(
              classId,
            )}`
          }
        />
      )}
    </div>
  );
}
