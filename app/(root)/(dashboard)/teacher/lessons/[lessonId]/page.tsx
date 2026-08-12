/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, Clock } from "lucide-react";
import { toast } from "sonner";

import {
  TeacherLessonService,
  LessonResponse,
} from "@/app/services/teacher-lesson.service";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getDayLabel } from "@/lib/utils";

type SectionItem = {
  key: string;
  title: string;
  minutes: number;
  content?: string | null;
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function RichSectionContent({ content }: { content?: string | null }) {
  if (!content) {
    return (
      <p className="text-sm italic text-muted-foreground">
        No content extracted for this section.
      </p>
    );
  }

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <div
        className="prose prose-sm max-w-none
                   prose-table:w-full prose-table:border-collapse
                   prose-th:border prose-th:bg-gray-100 prose-th:p-2
                   prose-td:border prose-td:p-2
                   prose-ul:list-disc prose-ul:pl-6
                   prose-ol:list-decimal prose-ol:pl-6"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-7">
      {content}
    </div>
  );
}

export default function TeacherLessonDetailPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function loadLesson() {
      try {
        setLoading(true);
        const data = await TeacherLessonService.getLesson(lessonId);
        setLesson(data);
      } catch (error: any) {
        toast.error(error?.response?.data?.detail ?? "Failed to load lesson.");
      } finally {
        setLoading(false);
      }
    }

    if (lessonId) void loadLesson();
  }, [lessonId]);

  const sections = useMemo<SectionItem[]>(() => {
    if (!lesson) return [];

    return [
      {
        key: "independent_reading",
        title: "Independent Reading",
        minutes: 7,
        content: lesson.alf?.independent_reading,
      },
      {
        key: "mini_lesson",
        title: "Mini Lesson",
        minutes: 7,
        content: lesson.alf?.mini_lesson,
      },
      {
        key: "case_study",
        title: "Case Study",
        minutes: 7,
        content: lesson.alf?.case_study,
      },
      {
        key: "project_based_learning",
        title: "Project Based Learning",
        minutes: 17,
        content: lesson.alf?.project_based_learning,
      },
      {
        key: "evaluation",
        title: "Evaluation",
        minutes: 2,
        content: lesson.alf?.evaluation,
      },
    ];
  }, [lesson]);

  const currentSection = sections[currentIndex];

  useEffect(() => {
    if (!currentSection) return;

    const totalSeconds = currentSection.minutes * 60;

    const initializeTimer = window.setTimeout(() => {
      setTimeLeft(totalSeconds);
      setCompleted(false);
    }, 0);

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearTimeout(initializeTimer);
      window.clearInterval(timer);
    };
  }, [currentIndex, currentSection]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (!lesson || !currentSection) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <h2 className="text-xl font-semibold">Lesson not found</h2>

        <p className="text-muted-foreground mt-2">
          The lesson you are trying to view does not exist.
        </p>

        <Button asChild className="mt-6">
          <Link href="/teacher/lessons">Back to Lessons</Link>
        </Button>
      </div>
    );
  }

  const totalSeconds = currentSection.minutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const isLast = currentIndex === sections.length - 1;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href="/teacher/lessons">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Link>
        </Button>

        {lesson.file_url && (
          <Button asChild size="sm">
            <a href={lesson.file_url} download target="_blank" rel="noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Download Original File
            </a>
          </Button>
        )}
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        <p className="text-muted-foreground">
          Week {lesson.week_number} • {getDayLabel(lesson.lesson_day)}
        </p>
      </div>

      {/* Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Learning Objectives</CardTitle>
          </CardHeader>

          <CardContent>
            <RichSectionContent content={lesson.objectives} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Teacher Notes</CardTitle>
          </CardHeader>

          <CardContent>
            <RichSectionContent content={lesson.teacher_notes} />
          </CardContent>
        </Card>
      </div>

      {/* Teaching Mode Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">Teaching Mode</h3>

            <p className="text-sm text-blue-700">
              Use the ALF sections below to guide classroom delivery.
            </p>
          </div>

          <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-900">
            Total: 40 mins
          </div>
        </div>
      </div>

      {/* Current Section */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl">{currentSection.title}</CardTitle>

              <p className="text-sm text-muted-foreground">
                Recommended time: {currentSection.minutes} minutes
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold">
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="text-xs text-muted-foreground">
            {completed
              ? "Time completed. You may continue to the next section."
              : "You can move between sections at any time; the timer is only a guide."}
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border bg-background p-6">
            <RichSectionContent content={currentSection.content} />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
        >
          Previous Section
        </Button>

        {isLast ? (
          <Button asChild className={completed ? "" : "opacity-80"}>
            <Link href="/teacher/lessons">Finish Lesson</Link>
          </Button>
        ) : (
          <Button
            className={completed ? "animate-pulse" : ""}
            onClick={() => setCurrentIndex((prev) => prev + 1)}
          >
            Next Section
          </Button>
        )}
      </div>
    </div>
  );
}
