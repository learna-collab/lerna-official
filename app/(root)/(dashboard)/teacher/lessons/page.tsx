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

type ClassOption = { id: string; name: string };
type SubjectOption = { id: string; name: string };

// UI labels mapped to backend values
const LESSON_DAYS = [
  { label: "Monday", value: "Day 1" },
  { label: "Tuesday", value: "Day 2" },
  { label: "Wednesday", value: "Day 3" },
  { label: "Thursday", value: "Day 4" },
  { label: "Friday", value: "Day 5" },
];

function getDayLabel(value: string) {
  return LESSON_DAYS.find((d) => d.value === value)?.label ?? value;
}

export default function TeacherLessonsPage() {
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [weekNumber, setWeekNumber] = useState("");

  // Keep backend value internally
  const [lessonDay, setLessonDay] = useState("Day 1");

  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");

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
    } catch {
      toast.error("Failed to load classes.");
    }
  }

  // =========================================================
  // LOAD SUBJECTS FOR SELECTED CLASS
  // =========================================================

  async function loadSubjects(selectedClassId: string) {
    if (!selectedClassId) {
      setSubjects([]);
      setSubjectId("");
      return;
    }

    try {
      const subjectData = await teacherService.getSubjects(selectedClassId);

      setSubjects(subjectData);

      if (subjectData.length > 0) {
        setSubjectId(subjectData[0].id);
      } else {
        setSubjectId("");
      }
    } catch {
      toast.error("Failed to load subjects.");
    }
  }

  // =========================================================
  // LOAD LESSONS
  // =========================================================

  async function loadLessons(selectedWeek?: number) {
    if (!classId || !subjectId || !sessionId || !termId) return;

    try {
      setLoading(true);

      const data = await TeacherLessonService.getLessons({
        classId,
        subjectId,
        sessionId,
        termId,
        weekNumber: selectedWeek,
      });

      // Filter by selected day on frontend
      const filtered = data.filter((lesson) => lesson.lesson_day === lessonDay);

      setLessons(filtered);
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
    void Promise.resolve().then(() => loadClasses());
  }, []);

  // =========================================================
  // LOAD SUBJECTS WHEN CLASS CHANGES
  // =========================================================

  useEffect(() => {
    if (classId) {
      void Promise.resolve().then(() => loadSubjects(classId));
    }
  }, [classId]);

  // =========================================================
  // LOAD LESSONS WHEN FILTERS CHANGE
  // =========================================================

  useEffect(() => {
    if (!academicLoading && sessionId && termId && classId && subjectId) {
      void Promise.resolve().then(() => loadLessons());
    }
  }, [academicLoading, sessionId, termId, classId, subjectId, lessonDay]);

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
    setLessonDay("Day 1");
    void loadLessons();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Lessons</h1>

        <p className="text-muted-foreground mt-1">
          View lesson notes assigned to your class and subject.
        </p>
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

        {/* Subject */}
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

        {/* Day */}
        <div className="space-y-2">
          <Label>Day</Label>

          <Select value={lessonDay} onValueChange={setLessonDay}>
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>

            <SelectContent>
              {LESSON_DAYS.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
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
          title="No lessons available"
          description="No lesson notes have been uploaded for the selected filters."
        />
      ) : (
        <LessonTable
          lessons={lessons.map((lesson) => ({
            id: lesson.id,
            week_number: lesson.week_number,
            lesson_day: getDayLabel(lesson.lesson_day),
            class_name: lesson.class_name,
            subject_name: lesson.subject_name,
            topic: lesson.topic,
            title: lesson.title,
          }))}
          basePath="/teacher/lessons"
        />
      )}
    </div>
  );
}
