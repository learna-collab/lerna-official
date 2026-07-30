/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Loader2 } from "lucide-react";

import { CBTService } from "@/app/services/cbt.service";

import type { StudentExamAttempt, StudentQuestion } from "@/app/types/cbt";

import ExamTimer from "../components/ExamTimer";
import ProgressBar from "../components/ProgressBar";
import QuestionCard from "../components/QuestionCard";
import QuestionNavigator from "../components/QuestionNavigator";
import { MobileNavigator } from "../components/MobileNavigator";
import SubmitDialog from "../components/SubmitDialog";
import AutoSaveIndicator from "../components/AutoSaveIndicator";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TakeExamPageProps {
  params: Promise<{
    attemptId: string;
  }>;
}

export default function TakeExamPage({ params }: TakeExamPageProps) {
  const { attemptId } = use(params);

  const router = useRouter();

  // =====================================================
  // STATES
  // =====================================================

  const [attempt, setAttempt] = useState<StudentExamAttempt | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  /**
   * question_id -> option_id
   */
  const [answers, setAnswers] = useState<Record<string, string>>({});

  /**
   * Auto-save
   */

  const [saving, setSaving] = useState(false);

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [saveError, setSaveError] = useState<string | null>(null);

  /**
   * Submission
   */

  const [submitOpen, setSubmitOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const hasAutoSubmitted = useRef(false);
  // =====================================================
  // LOAD ATTEMPT
  // =====================================================

  const loadAttempt = useCallback(async () => {
    try {
      setLoading(true);

      let response;

      // Try resume first.
      try {
        response = await CBTService.resumeExam(attemptId);
      } catch {
        response = null;
      }

      // No active attempt -> create one.
      if (!response?.success) {
        response = await CBTService.startExam(attemptId);
      }

      if (!response.success || !response.data) {
        toast.error(response.message ?? "Unable to load examination.");

        router.replace("/student/cbt");

        return;
      }

      const examAttempt = response.data;
      console.log(response.data.questions);
      console.log("========================================");
      console.log(response.data);

      setAttempt(examAttempt);

      const initialAnswers: Record<string, string> = {};

      examAttempt.questions.forEach((question) => {
        if (question.selected_option_id) {
          initialAnswers[question.id] = question.selected_option_id;
        }
      });

      setAnswers(initialAnswers);

      setCurrentQuestion(examAttempt.current_question_index ?? 0);
    } catch (error) {
      console.error(error);

      toast.error("Unable to reconnect to your examination.");

      router.replace("/student/cbt");
    } finally {
      setLoading(false);
    }
  }, [attemptId, router]);

  useEffect(() => {
    void Promise.resolve().then(() => loadAttempt());
  }, [loadAttempt]);

  // =====================================================
  // DERIVED VALUES
  // =====================================================

  const questions: StudentQuestion[] = useMemo(
    () => attempt?.questions ?? [],
    [attempt?.questions],
  );

  const totalQuestions = questions.length;

  const activeQuestion = questions[currentQuestion];

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const answeredIndexes = useMemo(() => {
    return questions.flatMap((question, index) =>
      answers[question.id] ? [index] : [],
    );
  }, [questions, answers]);

  // =====================================================
  // ANSWER SELECTION
  // =====================================================

  const handleSelectOption = useCallback(
    (questionId: string, optionId: string) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: optionId,
      }));
    },
    [],
  );

  // =====================================================
  // DEBOUNCED SAVE
  // =====================================================

  const [pendingSave, setPendingSave] = useState<{
    questionId: string;
    optionId: string;
  } | null>(null);

  // =====================================================
  // AUTO SAVE
  // =====================================================

  const saveAnswer = useCallback(
    async (questionId: string, optionId: string) => {
      if (!attempt) return;

      try {
        setSaving(true);
        setSaveError(null);

        await CBTService.submitAnswer({
          attempt_id: attempt.attempt_id,
          question_id: questionId,
          option_id: optionId,
        });

        setLastSaved(new Date());

        // <-- Add this
        setPendingSave((prev) => {
          if (prev?.questionId === questionId && prev.optionId === optionId) {
            return null;
          }

          return prev;
        });
      } catch (error) {
        console.error(error);

        setSaveError("Failed to save answer.");

        toast.error("Unable to save answer.");

        throw error;
      } finally {
        setSaving(false);
      }
    },
    [attempt],
  );

  useEffect(() => {
    if (!pendingSave) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      void saveAnswer(pendingSave.questionId, pendingSave.optionId);

      saveTimeoutRef.current = null;
    }, 700);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [pendingSave, saveAnswer]);

  // =====================================================
  // HANDLE SELECTION
  // =====================================================

  const onSelectOption = useCallback(
    (questionId: string, optionId: string) => {
      if (submitting) return;

      handleSelectOption(questionId, optionId);

      setPendingSave({
        questionId,
        optionId,
      });
    },
    [handleSelectOption, submitting],
  );
  // =====================================================
  // QUESTION NAVIGATION
  // =====================================================

  const goToQuestion = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalQuestions) return;

      setCurrentQuestion(index);

      if (attempt) {
        void CBTService.updateCurrentQuestion(attempt.attempt_id, index);
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [attempt, totalQuestions],
  );

  const nextQuestion = useCallback(() => {
    if (currentQuestion >= totalQuestions - 1) return;

    goToQuestion(currentQuestion + 1);
  }, [currentQuestion, totalQuestions, goToQuestion]);

  const previousQuestion = useCallback(() => {
    if (currentQuestion <= 0) return;

    goToQuestion(currentQuestion - 1);
  }, [currentQuestion, goToQuestion]);

  // =====================================================
  // KEYBOARD SHORTCUTS
  // =====================================================

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          nextQuestion();
          break;

        case "ArrowLeft":
          event.preventDefault();
          previousQuestion();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextQuestion, previousQuestion]);

  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const isFirstQuestion = currentQuestion === 0;

  // =====================================================
  // SUBMIT EXAM
  // =====================================================
  const flushPendingSave = useCallback(async () => {
    if (!pendingSave) return true;

    // Cancel the scheduled debounce save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    try {
      await saveAnswer(pendingSave.questionId, pendingSave.optionId);

      setPendingSave(null);

      return true;
    } catch {
      return false;
    }
  }, [pendingSave, saveAnswer]);
  const submitExam = useCallback(async () => {
    if (!attempt || submitting) return;

    try {
      setSubmitting(true);
      const saved = await flushPendingSave();

      if (!saved) {
        toast.error("Unable to save your latest answer. Please try again.");

        setSubmitting(false);

        return;
      }

      const response = await CBTService.submitExam(attempt.attempt_id);

      if (!response.success || !response.data) {
        throw new Error("Submission failed.");
      }

      toast.success("Examination submitted successfully.");

      router.replace(`/student/cbt/result/${attempt.attempt_id}`);
    } catch (error) {
      console.error(error);

      toast.error("Unable to submit examination. Please try again.");
    } finally {
      setSubmitting(false);
      setSubmitOpen(false);
    }
  }, [attempt, submitting, flushPendingSave, router]);

  // =====================================================
  // AUTO SUBMIT
  // =====================================================

  const handleTimeUp = useCallback(async () => {
    if (hasAutoSubmitted.current) return;

    hasAutoSubmitted.current = true;

    toast.warning("Time is up. Submitting examination...");

    await submitExam();
  }, [submitExam]);

  // =====================================================
  // PREVENT LEAVING DURING EXAM
  // =====================================================

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();

      (event as BeforeUnloadEvent & { returnValue: string }).returnValue =
        "You have an ongoing examination.";

      return "You have an ongoing examination.";
    };

    window.addEventListener("beforeunload", beforeUnload);

    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!attempt || !activeQuestion) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Card className="p-8">Examination not found.</Card>
      </div>
    );
  }
  return (
    <>
      <SubmitDialog
        open={submitOpen}
        answeredQuestions={answeredCount}
        totalQuestions={totalQuestions}
        submitting={submitting}
        onOpenChange={setSubmitOpen}
        onSubmit={() => void submitExam()}
      />

      <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
        {/* Timer */}

        <ExamTimer
          remainingSeconds={attempt.remaining_seconds}
          durationMinutes={attempt.duration_minutes}
          onTimeUp={handleTimeUp}
        />

        {/* Progress */}

        <ProgressBar
          currentQuestion={currentQuestion + 1}
          totalQuestions={totalQuestions}
          answeredQuestions={answeredCount}
        />

        {/* Mobile Navigator */}

        <MobileNavigator
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestion}
          answeredCount={answeredCount}
          answers={answers}
          questionIds={questions.map((q) => q.id)}
          onNavigate={goToQuestion}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* LEFT */}

          <div className="space-y-6">
            <AutoSaveIndicator
              saving={saving}
              lastSaved={lastSaved}
              error={saveError}
            />

            <QuestionCard
              question={activeQuestion}
              questionNumber={currentQuestion + 1}
              selectedOptionId={answers[activeQuestion.id]}
              onSelectOption={onSelectOption}
              disabled={submitting}
            />

            {/* Footer Navigation */}

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={isFirstQuestion || submitting}
                  onClick={previousQuestion}
                >
                  Previous
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Question{" "}
                  <span className="font-semibold">{currentQuestion + 1}</span>{" "}
                  of <span className="font-semibold">{totalQuestions}</span>
                </div>

                {isLastQuestion ? (
                  <Button
                    disabled={submitting}
                    onClick={() => setSubmitOpen(true)}
                  >
                    Review & Submit
                  </Button>
                ) : (
                  <Button disabled={submitting} onClick={nextQuestion}>
                    Next Question
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}

          <div className="hidden lg:block">
            <QuestionNavigator
              totalQuestions={totalQuestions}
              currentQuestion={currentQuestion}
              answeredQuestions={answeredIndexes}
              onSelectQuestion={goToQuestion}
            />
          </div>
        </div>
      </div>
    </>
  );
}
