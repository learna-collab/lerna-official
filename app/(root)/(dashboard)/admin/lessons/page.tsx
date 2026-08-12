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

export default function SuperAdminLessonsPage() {
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const [weekNumber, setWeekNumber] = useState("");

  // Day filter keeps backend value
  const [lessonDay, setLessonDay] = useState("Day 1");

  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [sessions, setSessions] = useState<{ id: string; name: string }[]>([]);
  const [terms, setTerms] = useState<{ id: string; name: string }[]>([]);

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [termId, setTermId] = useState("");

  // Load classes, sessions, terms only
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

      if (classData.length > 0) {
        setClassId(classData[0].id);
      }

      if (sessionData.length > 0) {
        setSessionId(sessionData[0].id);
      }

      if (termData.length > 0) {
        setTermId(termData[0].id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load filters.");
    } finally {
      setLoadingFilters(false);
    }
  }

  // Load subjects for selected class
  async function loadClassSubjects(classTemplateId: string) {
    if (!classTemplateId) {
      setSubjects([]);
      setSubjectId("");
      return;
    }

    try {
      setLoadingSubjects(true);

      const data =
        await SuperAdminLessonService.getClassSubjects(classTemplateId);

      setSubjects(data);

      if (data.length > 0) {
        setSubjectId(data[0].id);
      } else {
        setSubjectId("");
      }
    } catch (error: any) {
      console.error(error);

      setSubjects([]);
      setSubjectId("");

      toast.error(
        error?.response?.data?.detail ??
          "Failed to load subjects for this class.",
      );
    } finally {
      setLoadingSubjects(false);
    }
  }

  async function loadLessons(selectedWeek?: number) {
    if (!classId || !subjectId || !sessionId || !termId) return;

    try {
      setLoading(true);

      const data = await SuperAdminLessonService.getLessons({
        classTemplateId: classId,
        subjectTemplateId: subjectId,
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

  // Initial load
  useEffect(() => {
    void Promise.resolve().then(() => loadFilters());
  }, []);

  // Load subjects when class changes
  useEffect(() => {
    if (classId) {
      void Promise.resolve().then(() => loadClassSubjects(classId));
    }
  }, [classId]);

  // Load lessons when filters are ready
  useEffect(() => {
    if (classId && subjectId && sessionId && termId && !loadingSubjects) {
      void Promise.resolve().then(() => loadLessons());
    }
  }, [classId, subjectId, sessionId, termId, lessonDay, loadingSubjects]);

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lesson Notes</h1>

          <p className="text-muted-foreground mt-1">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Class */}
        <div className="space-y-2">
          <Label>Class</Label>

          <Select
            value={classId}
            onValueChange={(value) => {
              setClassId(value);
              setSubjectId("");
              setLessons([]);
            }}
          >
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
            disabled={!classId || loadingSubjects || subjects.length === 0}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingSubjects
                    ? "Loading subjects..."
                    : subjects.length === 0
                      ? "No subjects available"
                      : "Select subject"
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

          {classId && subjects.length === 0 && !loadingSubjects && (
            <p className="text-xs text-muted-foreground">
              No subjects have been assigned to this class.
            </p>
          )}
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
            lesson_day: getDayLabel(lesson.lesson_day),
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
