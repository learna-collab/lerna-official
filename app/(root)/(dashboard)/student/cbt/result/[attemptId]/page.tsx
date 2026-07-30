"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

import { CBTService } from "@/app/services/cbt.service";
import type { StudentResult } from "@/app/types/cbt";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import ScoreCard from "../components/ScoreCard";
import ResultSummary from "../components/ResultSummary";
import StatisticsCard from "../components/StatisticsCard";
import ResultActions from "../components/ResultActions";

interface PageProps {
  params: Promise<{
    attemptId: string;
  }>;
}

export default function StudentResultPage({ params }: PageProps) {
  const { attemptId } = use(params);

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [downloading, setDownloading] = useState(false);

  const [sharing, setSharing] = useState(false);

  const [result, setResult] = useState<StudentResult | null>(null);

  const loadResult = useCallback(async () => {
    try {
      setLoading(true);

      const response = await CBTService.getStudentResult(attemptId);

      if (!response.success || !response.data) {
        toast.error(response.message || "Unable to load result.");

        router.push("/student/cbt/history");

        return;
      }

      setResult(response.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load examination result.");

      router.push("/student/cbt/history");
    } finally {
      setLoading(false);
    }
  }, [attemptId, router]);

  useEffect(() => {
    void Promise.resolve().then(() => loadResult());
  }, [loadResult]);

  async function handleDownload() {
    try {
      setDownloading(true);

      toast.info("Download feature coming soon.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleShare() {
    if (!result) return;

    try {
      setSharing(true);

      if (navigator.share) {
        await navigator.share({
          title: result.exam_title,
          text: `I scored ${result.score}/${result.total_marks} (${result.percentage.toFixed(
            1,
          )}%) in ${result.exam_title}.`,
        });
      } else {
        await navigator.clipboard.writeText(
          `${result.exam_title}
Score: ${result.score}/${result.total_marks}
Percentage: ${result.percentage.toFixed(1)}%
Status: ${result.passed ? "PASSED" : "FAILED"}`,
        );

        toast.success("Result copied to clipboard.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSharing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-4xl p-8">
        <Card>
          <CardContent className="space-y-6 py-12 text-center">
            <h2 className="text-2xl font-bold">Result Not Found</h2>

            <p className="text-muted-foreground">
              We couldn&apos;t find the requested examination result.
            </p>

            <Button onClick={() => router.push("/student/cbt/history")}>
              Back to History
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/student/cbt/history")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <ResultActions
          allowDownload
          allowShare
          downloading={downloading}
          sharing={sharing}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      </div>
      {/* Main Content */}

      <div className="grid gap-8 xl:grid-cols-[380px_1fr]">
        {/* Left Sidebar */}

        <div className="space-y-6">
          <ScoreCard result={result} />

          <StatisticsCard result={result} />
        </div>

        {/* Right Content */}

        <div className="space-y-8">
          <ResultSummary result={result} />

          <Card>
            <CardContent className="space-y-6 p-6">
              <div>
                <h2 className="text-2xl font-bold">Examination Summary</h2>

                <p className="mt-1 text-muted-foreground">
                  Below is a breakdown of your overall performance.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border p-5">
                  <p className="text-sm text-muted-foreground">Exam</p>

                  <p className="mt-2 text-lg font-semibold">
                    {result.exam_title}
                  </p>
                </div>

                <div className="rounded-xl border p-5">
                  <p className="text-sm text-muted-foreground">Subject</p>

                  <p className="mt-2 text-lg font-semibold">
                    {result.subject_name}
                  </p>
                </div>

                <div className="rounded-xl border p-5">
                  <p className="text-sm text-muted-foreground">Score</p>

                  <p className="mt-2 text-3xl font-bold">
                    {result.score}
                    <span className="text-base font-normal text-muted-foreground">
                      {" "}
                      / {result.total_marks}
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border p-5">
                  <p className="text-sm text-muted-foreground">Percentage</p>

                  <p
                    className={`mt-2 text-3xl font-bold ${
                      result.passed ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.percentage.toFixed(1)}%
                  </p>
                </div>

                <div className="rounded-xl border p-5">
                  <p className="text-sm text-muted-foreground">
                    Correct Answers
                  </p>

                  <p className="mt-2 text-3xl font-bold text-green-600">
                    {result.correct_answers}
                  </p>
                </div>

                <div className="rounded-xl border p-5">
                  <p className="text-sm text-muted-foreground">Wrong Answers</p>

                  <p className="mt-2 text-3xl font-bold text-red-600">
                    {result.wrong_answers}
                  </p>
                </div>

                <div className="rounded-xl border p-5">
                  <p className="text-sm text-muted-foreground">
                    Questions Answered
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {result.answered_questions}
                  </p>
                </div>

                <div className="rounded-xl border p-5">
                  <p className="text-sm text-muted-foreground">
                    Total Questions
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {result.total_questions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-6 p-6">
              <div>
                <h2 className="text-xl font-bold">Performance Insights</h2>

                <p className="text-muted-foreground">
                  A quick summary of how you performed in this examination.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                  <div>
                    <h3 className="font-semibold">Overall Result</h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Your final examination status.
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      result.passed
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    }`}
                  >
                    {result.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                  <div>
                    <h3 className="font-semibold">Accuracy</h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Correct answers relative to answered questions.
                    </p>
                  </div>

                  <span className="text-lg font-bold">
                    {result.answered_questions > 0
                      ? (
                          (result.correct_answers / result.answered_questions) *
                          100
                        ).toFixed(1)
                      : "0.0"}
                    %
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                  <div>
                    <h3 className="font-semibold">Completion Rate</h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Questions attempted during the examination.
                    </p>
                  </div>

                  <span className="text-lg font-bold">
                    {(
                      (result.answered_questions / result.total_questions) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                  <div>
                    <h3 className="font-semibold">Examination Period</h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Start and submission time.
                    </p>
                  </div>

                  <div className="text-right text-sm">
                    <p>
                      <strong>Started:</strong>
                    </p>

                    <p>{new Date(result.started_at).toLocaleString()}</p>

                    {result.completed_at && (
                      <>
                        <p className="mt-3">
                          <strong>Submitted:</strong>
                        </p>

                        <p>{new Date(result.completed_at).toLocaleString()}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ResultActions
            allowDownload
            allowShare
            downloading={downloading}
            sharing={sharing}
            onDownload={handleDownload}
            onShare={handleShare}
          />
        </div>
      </div>
    </div>
  );
}
