"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";

import {
  SchoolAdminLessonService,
  LessonResponse,
} from "@/app/services/school-admin-lesson.service";

import { LessonHeader } from "@/components/lessons/LessonHeader";
import { LessonInfoCard } from "@/components/lessons/LessonInfoCard";
import { ALFSectionCard } from "@/components/lessons/ALFSectionCard";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SchoolAdminLessonDetailPage() {
  const params = useParams();

  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadLesson() {
    try {
      setLoading(true);

      const data = await SchoolAdminLessonService.getLesson(lessonId);

      setLesson(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail ?? "Failed to load lesson.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (lessonId) {
      void Promise.resolve().then(() => loadLesson());
    }
  }, [lessonId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <h2 className="text-xl font-semibold">Lesson not found</h2>

        <p className="text-muted-foreground mt-2">
          The lesson you are trying to view does not exist.
        </p>

        <Button asChild className="mt-6">
          <Link href="/school-admin/lessons">Back to Lessons</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href="/school-admin/lessons">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Link>
        </Button>

        {lesson.file_url && (
          <Button asChild size="sm">
            <a href={lesson.file_url} target="_blank" rel="noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Download Original File
            </a>
          </Button>
        )}
      </div>

      {/* Header */}
      <LessonHeader
        title={lesson.title}
        topic={lesson.topic}
        weekNumber={lesson.week_number}
        lessonDay={lesson.lesson_day}
      />

      {/* Lesson Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <LessonInfoCard label="Learning Objectives" value={lesson.objectives} />

        <LessonInfoCard label="Teacher Notes" value={lesson.teacher_notes} />
      </div>

      {/* Read-only Banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-amber-900">Read-only View</h3>

            <p className="text-sm text-amber-700">
              School administrators can review published lesson notes but cannot
              modify them.
            </p>
          </div>

          <div className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
            Total: 40 mins
          </div>
        </div>
      </div>

      {/* ALF Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ALFSectionCard
          title="Independent Reading"
          minutes={7}
          content={lesson.alf?.independent_reading}
        />

        <ALFSectionCard
          title="Mini Lesson"
          minutes={7}
          content={lesson.alf?.mini_lesson}
        />

        <ALFSectionCard
          title="Case Study"
          minutes={7}
          content={lesson.alf?.case_study}
        />

        <ALFSectionCard
          title="Project Based Learning"
          minutes={17}
          content={lesson.alf?.project_based_learning}
        />
      </div>

      <ALFSectionCard
        title="Evaluation"
        minutes={2}
        content={lesson.alf?.evaluation}
      />
    </div>
  );
}
