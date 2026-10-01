"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import {
  TeacherLessonService,
  LessonResponse,
} from "@/app/services/teacher-lesson.service";

import {
  TeacherALFService,
  ALFSessionResponse,
} from "@/app/services/teacher-alf.service";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import { getDayLabel } from "@/lib/utils";

// ============================================================
// TYPES
// ============================================================

type SectionKey =
  | "independent_reading"
  | "mini_lesson"
  | "case_study"
  | "project_based_learning"
  | "evaluation";

type SectionItem = {
  key: SectionKey;
  title: string;
  minutes: number;
  content?: string | null;
};

// ============================================================
// HELPERS
// ============================================================

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, seconds);

  const minutes = Math.floor(safeSeconds / 60);

  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, seconds);

  const hours = Math.floor(safeSeconds / 3600);

  const minutes = Math.floor((safeSeconds % 3600) / 60);

  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}

// ============================================================
// RICH CONTENT
// ============================================================

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
        className="
          prose prose-sm max-w-none
          prose-table:w-full
          prose-table:border-collapse
          prose-th:border
          prose-th:bg-gray-100
          prose-th:p-2
          prose-td:border
          prose-td:p-2
          prose-ul:list-disc
          prose-ul:pl-6
          prose-ol:list-decimal
          prose-ol:pl-6
        "
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    );
  }

  return (
    <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-7">
      {content}
    </div>
  );
}

// ============================================================
// ALF PROGRESS PAYLOAD
// ============================================================

function getProgressPayload(key: SectionKey) {
  switch (key) {
    case "independent_reading":
      return {
        independent_reading_completed: true,
      };

    case "mini_lesson":
      return {
        mini_lesson_completed: true,
      };

    case "case_study":
      return {
        case_study_completed: true,
      };

    case "project_based_learning":
      return {
        project_based_learning_completed: true,
      };

    case "evaluation":
      return {
        evaluation_completed: true,
      };

    default:
      return {};
  }
}

// ============================================================
// CHECK SECTION COMPLETION
// ============================================================

function isSectionCompleted(
  session: ALFSessionResponse | null,
  key: SectionKey,
) {
  if (!session) {
    return false;
  }

  switch (key) {
    case "independent_reading":
      return session.independent_reading_completed;

    case "mini_lesson":
      return session.mini_lesson_completed;

    case "case_study":
      return session.case_study_completed;

    case "project_based_learning":
      return session.project_based_learning_completed;

    case "evaluation":
      return session.evaluation_completed;

    default:
      return false;
  }
}

// ============================================================
// PAGE
// ============================================================

export default function TeacherLessonDetailPage() {
  const params = useParams();

  const searchParams = useSearchParams();

  const lessonId = params.lessonId as string;

  const classId = searchParams.get("classId");

  // ==========================================================
  // STATE
  // ==========================================================

  const [lesson, setLesson] = useState<LessonResponse | null>(null);

  const [alfSession, setAlfSession] = useState<ALFSessionResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [startingSession, setStartingSession] = useState(false);

  const [updatingProgress, setUpdatingProgress] = useState(false);

  const [completingSession, setCompletingSession] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [timeLeft, setTimeLeft] = useState(0);

  const [completed, setCompleted] = useState(false);

  const startingRef = useRef(false);

  const completedSessionRef = useRef(false);

  // ==========================================================
  // LOAD LESSON
  // ==========================================================

  useEffect(() => {
    if (!lessonId) {
      return;
    }

    async function loadLesson() {
      try {
        setLoading(true);

        const data = await TeacherLessonService.getLesson(lessonId);

        setLesson(data);
      } catch (error: any) {
        console.error("Failed to load lesson:", error);

        toast.error(error?.response?.data?.detail ?? "Failed to load lesson.");

        setLesson(null);
      } finally {
        setLoading(false);
      }
    }

    void loadLesson();
  }, [lessonId]);

  // ==========================================================
  // ALF SECTIONS
  // ==========================================================

  const sections = useMemo<SectionItem[]>(() => {
    if (!lesson) {
      return [];
    }

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

  // ==========================================================
  // START ALF SESSION
  // ==========================================================

  useEffect(() => {
    /*
     * Lesson has not loaded yet.
     */
    if (!lesson) {
      return;
    }

    /*
     * If there is no ALF content, there is no session
     * to start. Most importantly, don't leave the page
     * stuck in the loading state.
     */
    if (!lesson.alf) {
      return;
    }

    /*
     * If the class ID is missing, don't attempt the API
     * call. The UI will show the class information error.
     */
    if (!classId) {
      return;
    }

    /*
     * Prevent duplicate session creation.
     */
    if (startingRef.current) {
      return;
    }

    async function startSession() {
      try {
        startingRef.current = true;

        setStartingSession(true);

        const session = await TeacherALFService.startSession(lessonId, {
          class_id: classId!,
        });

        setAlfSession(session);

        /*
         * Restore the first incomplete section.
         */
        const incompleteIndex = sections.findIndex(
          (section) => !isSectionCompleted(session, section.key),
        );

        if (incompleteIndex >= 0) {
          setCurrentIndex(incompleteIndex);
        } else if (sections.length > 0) {
          /*
           * All sections are already complete.
           * Display the final section.
           */
          setCurrentIndex(sections.length - 1);
        }
      } catch (error: any) {
        console.error("Failed to start ALF session:", error);

        toast.error(
          error?.response?.data?.detail ?? "Unable to start ALF session.",
        );
      } finally {
        setStartingSession(false);
      }
    }

    void startSession();
  }, [lesson, lessonId, classId, sections]);

  // ==========================================================
  // SECTION TIMER
  // ==========================================================

  useEffect(() => {
    if (!currentSection || !alfSession) {
      return;
    }

    /*
     * Don't run the timer after the session is completed.
     */
    if (alfSession.status === "COMPLETED") {
      const timeout = window.setTimeout(() => {
        setTimeLeft(0);
        setCompleted(true);
      }, 0);

      return () => {
        window.clearTimeout(timeout);
      };
    }

    const totalSeconds = currentSection.minutes * 60;

    const initializeTimeout = window.setTimeout(() => {
      setTimeLeft(totalSeconds);
      setCompleted(false);
    }, 0);

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);

          setCompleted(true);

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearTimeout(initializeTimeout);
      window.clearInterval(timer);
    };
  }, [currentIndex, currentSection, alfSession]);

  // ==========================================================
  // MARK CURRENT SECTION COMPLETE
  // ==========================================================

  async function markCurrentSectionComplete() {
    if (!alfSession || !currentSection) {
      return false;
    }

    /*
     * If this section was already recorded, don't
     * make another PATCH request.
     */
    if (isSectionCompleted(alfSession, currentSection.key)) {
      return true;
    }

    /*
     * Don't attempt to modify a completed session.
     */
    if (alfSession.status === "COMPLETED") {
      return true;
    }

    try {
      setUpdatingProgress(true);

      const updated = await TeacherALFService.updateProgress(
        alfSession.id,
        getProgressPayload(currentSection.key),
      );

      setAlfSession(updated);

      return true;
    } catch (error: any) {
      console.error("Failed to record ALF progress:", error);

      toast.error(
        error?.response?.data?.detail ?? "Failed to record ALF progress.",
      );

      return false;
    } finally {
      setUpdatingProgress(false);
    }
  }

  // ==========================================================
  // COMPLETE ALF SESSION
  // ==========================================================

  async function finishALFSession() {
    if (!alfSession) {
      return;
    }

    /*
     * Prevent duplicate completion requests.
     */
    if (completedSessionRef.current) {
      return;
    }

    /*
     * If already completed, nothing else to do.
     */
    if (alfSession.status === "COMPLETED") {
      return;
    }

    /*
     * Record the current section first.
     */
    const sectionRecorded = await markCurrentSectionComplete();

    if (!sectionRecorded) {
      return;
    }

    try {
      completedSessionRef.current = true;

      setCompletingSession(true);

      const completedSession = await TeacherALFService.completeSession(
        alfSession.id,
      );

      setAlfSession(completedSession);

      setCompleted(true);

      setTimeLeft(0);

      toast.success("ALF lesson session completed.");
    } catch (error: any) {
      console.error("Failed to complete ALF session:", error);

      completedSessionRef.current = false;

      toast.error(
        error?.response?.data?.detail ?? "Failed to complete ALF session.",
      );
    } finally {
      setCompletingSession(false);
    }
  }

  // ==========================================================
  // NEXT SECTION
  // ==========================================================

  async function handleNextSection() {
    if (!currentSection) {
      return;
    }

    /*
     * Save current section first.
     */
    const sectionRecorded = await markCurrentSectionComplete();

    if (!sectionRecorded) {
      return;
    }

    /*
     * If this is the final section, complete
     * the entire ALF session.
     */
    if (currentIndex >= sections.length - 1) {
      await finishALFSession();

      return;
    }

    setCurrentIndex((previous) => Math.min(previous + 1, sections.length - 1));
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-6">
        <Skeleton className="h-10 w-64" />

        <Skeleton className="h-20 w-full" />

        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  // ==========================================================
  // LESSON NOT FOUND
  // ==========================================================

  if (!lesson) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <h2 className="text-xl font-semibold">Lesson not found</h2>

        <p className="mt-2 text-muted-foreground">
          The lesson you are trying to view does not exist.
        </p>

        <Button asChild className="mt-6">
          <Link href="/teacher/lessons">Back to Lessons</Link>
        </Button>
      </div>
    );
  }

  // ==========================================================
  // CLASS ID MISSING
  // ==========================================================

  if (!classId) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <h2 className="text-xl font-semibold">Class information is missing</h2>

        <p className="mt-2 text-muted-foreground">
          Please return to My Lessons and open the lesson from a selected class.
        </p>

        <Button asChild className="mt-6">
          <Link href="/teacher/lessons">Back to Lessons</Link>
        </Button>
      </div>
    );
  }

  // ==========================================================
  // ALF CONTENT MISSING
  // ==========================================================

  if (!lesson.alf) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <h2 className="text-xl font-semibold">ALF content unavailable</h2>

        <p className="mt-2 text-muted-foreground">
          This lesson does not contain ALF teaching content.
        </p>

        <Button asChild className="mt-6">
          <Link href="/teacher/lessons">Back to Lessons</Link>
        </Button>
      </div>
    );
  }

  // ==========================================================
  // ALF SESSION STARTING
  // ==========================================================

  if (startingSession) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-6">
        <Skeleton className="h-10 w-64" />

        <Skeleton className="h-20 w-full" />

        <Skeleton className="h-80 w-full" />

        <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Starting ALF teaching session...
        </div>
      </div>
    );
  }

  // ==========================================================
  // CURRENT SECTION SAFETY
  // ==========================================================

  if (!currentSection) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <h2 className="text-xl font-semibold">ALF sections unavailable</h2>

        <p className="mt-2 text-muted-foreground">
          No ALF teaching sections are available for this lesson.
        </p>

        <Button asChild className="mt-6">
          <Link href="/teacher/lessons">Back to Lessons</Link>
        </Button>
      </div>
    );
  }

  // ==========================================================
  // DERIVED VALUES
  // ==========================================================

  const totalSeconds = currentSection.minutes * 60;

  const progress =
    totalSeconds > 0
      ? Math.min(
          100,
          Math.max(0, ((totalSeconds - timeLeft) / totalSeconds) * 100),
        )
      : 0;

  const isLast = currentIndex === sections.length - 1;

  const sessionProgress = alfSession?.progress_percentage ?? 0;

  const sectionCompleted = alfSession
    ? isSectionCompleted(alfSession, currentSection.key)
    : false;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* ======================================================
          TOP BAR
      ====================================================== */}

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

      {/* ======================================================
          LESSON HEADER
      ====================================================== */}

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{lesson.title}</h1>

        <p className="text-muted-foreground">
          Week {lesson.week_number} • {getDayLabel(lesson.lesson_day)}
        </p>
      </div>

      {/* ======================================================
          SESSION STATUS
      ====================================================== */}

      {alfSession && (
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ALF Session</p>

                <div className="mt-1 flex items-center gap-2">
                  {alfSession.status === "COMPLETED" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  )}

                  <span className="font-semibold">
                    {alfSession.status === "COMPLETED"
                      ? "Completed"
                      : "In Progress"}
                  </span>
                </div>
              </div>

              <div className="min-w-[220px]">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ALF Progress</span>

                  <span className="font-semibold">{sessionProgress}%</span>
                </div>

                <Progress value={sessionProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ======================================================
          OBJECTIVES / NOTES
      ====================================================== */}

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

      {/* ======================================================
          TEACHING MODE
      ====================================================== */}

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

      {/* ======================================================
          SECTION NAVIGATION
      ====================================================== */}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {sections.map((section, index) => {
          const done = alfSession
            ? isSectionCompleted(alfSession, section.key)
            : false;

          const active = index === currentIndex;

          return (
            <button
              key={section.key}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`
                  rounded-lg border p-3 text-left
                  transition
                  ${
                    active
                      ? "border-blue-500 bg-blue-50"
                      : "bg-background hover:bg-muted"
                  }
                `}
            >
              <div className="flex items-center gap-2">
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                )}

                <span className="text-xs font-medium">{index + 1}</span>
              </div>

              <p className="mt-2 text-xs font-medium">{section.title}</p>
            </button>
          );
        })}
      </div>

      {/* ======================================================
          CURRENT SECTION
      ====================================================== */}

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
            {sectionCompleted
              ? "This section has been recorded."
              : completed
                ? "Recommended time completed. You may continue."
                : "The timer is a guide. You may continue before it reaches zero."}
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border bg-background p-6">
            <RichSectionContent content={currentSection.content} />
          </div>
        </CardContent>
      </Card>

      {/* ======================================================
          NAVIGATION
      ====================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          disabled={currentIndex === 0 || updatingProgress || completingSession}
          onClick={() =>
            setCurrentIndex((previous) => Math.max(previous - 1, 0))
          }
        >
          Previous Section
        </Button>

        {isLast ? (
          <Button
            disabled={
              updatingProgress ||
              completingSession ||
              alfSession?.status === "COMPLETED"
            }
            onClick={() => void finishALFSession()}
          >
            {completingSession || updatingProgress ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recording...
              </>
            ) : alfSession?.status === "COMPLETED" ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                ALF Completed
              </>
            ) : (
              "Complete ALF Lesson"
            )}
          </Button>
        ) : (
          <Button
            disabled={updatingProgress || completingSession}
            onClick={() => void handleNextSection()}
          >
            {updatingProgress ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Complete & Continue"
            )}
          </Button>
        )}
      </div>

      {/* ======================================================
          SESSION DURATION
      ====================================================== */}

      {alfSession && (
        <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          Session started {new Date(alfSession.started_at).toLocaleString()}
          {" · "}
          Recorded duration: {formatDuration(alfSession.duration_seconds)}
        </div>
      )}
    </div>
  );
}
