"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  SuperAdminLessonService,
  LessonResponse,
} from "@/app/services/super-admin-lesson.service";

import { LessonHeader } from "@/components/lessons/LessonHeader";
import { LessonInfoCard } from "@/components/lessons/LessonInfoCard";
import { ALFSectionCard } from "@/components/lessons/ALFSectionCard";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function SuperAdminLessonDetailPage() {
  const params = useParams();

  const router = useRouter();

  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadLesson() {
    try {
      setLoading(true);

      const data = await SuperAdminLessonService.getLesson(lessonId);

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

  async function handlePublish(value: boolean) {
    try {
      setPublishing(true);

      const updated = await SuperAdminLessonService.publishLesson(
        lessonId,
        value,
      );

      setLesson(updated);

      toast.success(
        value
          ? "Lesson published successfully."
          : "Lesson unpublished successfully.",
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ?? "Failed to update lesson status.",
      );
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await SuperAdminLessonService.deleteLesson(lessonId);

      toast.success("Lesson deleted successfully.");

      router.push("/admin/lessons");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail ?? "Failed to delete lesson.");
    } finally {
      setDeleting(false);
    }
  }

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
          <Link href="/admin/lessons">Back to Lessons</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/lessons">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Link>
        </Button>

        <div className="flex flex-wrap gap-2">
          {/* {lesson.file_url && (
            <Button asChild size="sm" variant="outline">
              <a href={lesson.file_url} target="_blank" rel="noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download File
              </a>
            </Button>
          )} */}

          {/* {lesson.is_published ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePublish(false)}
              disabled={publishing}
            >
              <XCircle className="mr-2 h-4 w-4" />
              {publishing ? "Updating..." : "Unpublish"}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => handlePublish(true)}
              disabled={publishing}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {publishing ? "Publishing..." : "Publish"}
            </Button>
          )} */}

          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={lesson.is_published ? "default" : "secondary"}>
            {lesson.is_published ? "Published" : "Draft"}
          </Badge>
        </div>

        <LessonHeader
          title={lesson.title}
          topic={lesson.topic}
          weekNumber={lesson.week_number}
          lessonDay={lesson.lesson_day}
        />
      </div>

      {/* Lesson Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <LessonInfoCard label="Learning Objectives" value={lesson.objectives} />

        <LessonInfoCard label="Teacher Notes" value={lesson.teacher_notes} />
      </div>

      {/* ALF Summary Banner */}
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-green-900">
              ALF Extraction Complete
            </h3>

            <p className="text-sm text-green-700">
              The uploaded lesson file has been processed and the ALF sections
              were extracted successfully.
            </p>
          </div>

          <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-900">
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
