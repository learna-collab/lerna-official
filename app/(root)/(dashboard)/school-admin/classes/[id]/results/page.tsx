"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { toast } from "sonner";

import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Send,
  Download,
  Eye,
  Loader2,
} from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import { useClassContext } from "@/components/sidebar/ClassContext";
import { AcademicSetupService } from "@/app/services/academicSetup.service";

/* ============================================================
 * TYPES
 * ============================================================ */

interface AcademicSession {
  id: string;
  name: string;
}

interface Term {
  id: string;
  name: string;
}

interface StudentResult {
  student_id: string;
  student_name: string;
  total_score: number;
  average_score: number;
  position: number;
  passed_subjects: number;
  failed_subjects: number;
}

interface ClassResultResponse {
  batch_id: string;
  status: string;
  editable: boolean;
  students: StudentResult[];
}

export default function ClassResultsPage() {
  const params = useParams();

  const classId = params.id as string;

  const { className, classLevel } = useClassContext();

  const [loading, setLoading] = useState(false);

  const [sessions, setSessions] = useState<AcademicSession[]>([]);

  const [terms, setTerms] = useState<Term[]>([]);

  const [sessionId, setSessionId] = useState("");

  const [termId, setTermId] = useState("");

  const [rejectNote, setRejectNote] = useState("");

  const [resultBatch, setResultBatch] = useState<ClassResultResponse | null>(
    null,
  );

  const status = resultBatch?.status ?? "";

  const hasBatch = !!resultBatch?.batch_id;

  const isDraft = status === "DRAFT";
  const isSubmitted = status === "SUBMITTED";
  const isApproved = status === "APPROVED";
  const isRejected = status === "REJECTED";
  const isPublished = status === "PUBLISHED";
  const isEmpty = status === "EMPTY";

  const canApprove = hasBatch && (isDraft || isSubmitted);

  const canReject = hasBatch && (isDraft || isSubmitted || isApproved);

  const canPublish = hasBatch && isApproved;

  /* ============================================================
   * LOAD FILTERS
   * ============================================================ */

  async function loadFilters() {
    try {
      const options = await AcademicSetupService.getAcademicPeriodOptions();

      setSessions(options.sessions);
      setTerms(options.terms);

      // Optional: preselect first available values
      if (options.sessions.length > 0) {
        setSessionId(options.sessions[0].id);
      }

      if (options.terms.length > 0) {
        setTermId(options.terms[0].id);
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to load sessions and terms.");
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadFilters());
  }, []);

  /* ============================================================
   * LOAD CLASS RESULTS
   * ============================================================ */

  async function loadResults() {
    if (!sessionId || !termId) {
      toast.error("Select session and term.");
      return;
    }

    try {
      setLoading(true);

      const data = await SchoolAdminService.getClassResults({
        classId,
        sessionId,
        termId,
      });

      /**
       * Backend now returns an empty batch instead of 404.
       */

      setResultBatch(data);

      if (!data.batch_id) {
        toast.info("No results have been uploaded for this class yet.");
      }
    } catch (error: any) {
      console.error(error);

      /**
       * Support old backend returning 404
       */

      if (error?.response?.status === 404) {
        setResultBatch({
          batch_id: "",
          status: "EMPTY",
          editable: false,
          students: [],
        });

        toast.info("No results have been uploaded yet.");

        return;
      }

      toast.error("Failed to load results.");

      setResultBatch(null);
    } finally {
      setLoading(false);
    }
  }
  /* ============================================================
   * ACTIONS
   * ============================================================ */

  async function approveBatch() {
    if (!resultBatch) return;

    try {
      await SchoolAdminService.approveResult(resultBatch.batch_id);

      toast.success("Results approved.");

      await loadResults();
    } catch {
      toast.error("Approval failed.");
    }
  }

  async function publishBatch() {
    if (!resultBatch) return;

    try {
      await SchoolAdminService.publishResult(resultBatch.batch_id);

      toast.success("Results published.");

      await loadResults();
    } catch {
      toast.error("Publish failed.");
    }
  }

  async function rejectBatch() {
    if (!resultBatch) return;

    if (!rejectNote.trim()) {
      toast.error("Enter rejection note.");

      return;
    }

    try {
      await SchoolAdminService.rejectResult(resultBatch.batch_id, {
        note: rejectNote,
      });

      toast.success("Results rejected.");

      setRejectNote("");

      await loadResults();
    } catch {
      toast.error("Reject failed.");
    }
  }

  async function exportResults() {
    try {
      const blob = await SchoolAdminService.exportResults(
        classId,
        sessionId,
        termId,
      );

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = `${className ?? "class"}-results.xlsx`;

      a.click();

      window.URL.revokeObjectURL(url);

      toast.success("Results exported.");
    } catch {
      toast.error("Export failed.");
    }
  }
  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Button asChild variant="ghost" className="mb-3 -ml-3">
            <Link href={`/school-admin/classes/${classId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Class Dashboard
            </Link>
          </Button>

          <h1 className="text-3xl font-bold">Class Results</h1>

          <p className="mt-1 text-muted-foreground">
            Review, approve and publish results for this class.
          </p>
        </div>

        <Card className="min-w-[280px]">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Selected Class</p>

              <h3 className="text-xl font-bold">{className ?? "Loading..."}</h3>

              {classLevel && (
                <span className="mt-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {classLevel}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS */}

      <Card>
        <CardHeader>
          <CardTitle>Result Filters</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Select value={sessionId} onValueChange={setSessionId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Session" />
              </SelectTrigger>

              <SelectContent>
                {sessions.map((session) => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={termId} onValueChange={setTermId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>

              <SelectContent>
                {terms.map((term) => (
                  <SelectItem key={term.id} value={term.id}>
                    {term.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={loadResults} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Eye className="mr-2 h-4 w-4" />
              )}
              View Results
            </Button>

            <Button
              variant="secondary"
              onClick={exportResults}
              disabled={!hasBatch}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button onClick={approveBatch} disabled={!canApprove}>
              <CheckCircle className="mr-2 h-4 w-4" />

              {isApproved ? "Approved" : "Approve"}
            </Button>

            <Button onClick={publishBatch} disabled={!canPublish}>
              <Send className="mr-2 h-4 w-4" />

              {isPublished ? "Published" : "Publish"}
            </Button>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              placeholder="Reason for rejection..."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />

            <Button
              variant="destructive"
              onClick={rejectBatch}
              disabled={!canReject}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>

          {status && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Current Status
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold
                ${
                  isApproved
                    ? "bg-green-100 text-green-700"
                    : isRejected
                      ? "bg-red-100 text-red-700"
                      : isPublished
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {status}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
      {/* STUDENTS RESULTS */}

      {resultBatch && (
        <Card>
          <CardHeader>
            <CardTitle>
              Students Results ({resultBatch.students.length})
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <h3 className="text-lg font-semibold">No Result Batch Found</h3>

                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  No results have been uploaded for this class in the selected
                  session and term yet.
                </p>
              </div>
            ) : resultBatch.students.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                No students found.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left">Student</th>
                      <th className="px-4 py-3 text-center">Total</th>
                      <th className="px-4 py-3 text-center">Average</th>
                      <th className="px-4 py-3 text-center">Position</th>
                      <th className="px-4 py-3 text-center">Passed</th>
                      <th className="px-4 py-3 text-center">Failed</th>
                    </tr>
                  </thead>

                  <tbody>
                    {resultBatch.students.map((student) => (
                      <tr
                        key={student.student_id}
                        className="border-t hover:bg-muted/30"
                      >
                        <td className="px-4 py-3 font-medium">
                          {student.student_name}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {student.total_score}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {student.average_score}%
                        </td>

                        <td className="px-4 py-3 text-center">
                          {student.position}
                        </td>

                        <td className="px-4 py-3 text-center text-green-600">
                          {student.passed_subjects}
                        </td>

                        <td className="px-4 py-3 text-center text-red-600">
                          {student.failed_subjects}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
