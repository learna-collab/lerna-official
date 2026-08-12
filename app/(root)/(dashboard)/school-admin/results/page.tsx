"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Send,
  Download,
  Eye,
  Loader2,
} from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { AcademicSetupService } from "@/app/services/academicSetup.service";

/* TYPES */
interface SchoolClass {
  id: string;
  name: string;
}

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
  status: "draft" | "approved" | "published" | "rejected" | string;
  editable: boolean;
  students: StudentResult[];
}

export default function ResultsPage() {
  const [loading, setLoading] = useState(false);

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);

  const [classId, setClassId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [termId, setTermId] = useState("");

  const [rejectNote, setRejectNote] = useState("");

  const [resultBatch, setResultBatch] = useState<ClassResultResponse | null>(
    null,
  );

  const status = resultBatch?.status ?? "";

  const isDraft = status === "DRAFT";
  const isSubmitted = status === "SUBMITTED";
  const isApproved = status === "APPROVED";
  const isRejected = status === "REJECTED";
  const isPublished = status === "PUBLISHED";

  const canApprove = !!resultBatch && (isDraft || isSubmitted);

  const canReject = !!resultBatch && (isDraft || isSubmitted || isApproved);

  const canPublish = !!resultBatch && isApproved;

  const normalize = (response: any) => {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response.data)) return response.data;

    if (Array.isArray(response.sessions)) return response.sessions;

    if (Array.isArray(response.classes)) return response.classes;

    if (Array.isArray(response.terms)) return response.terms;

    if (Array.isArray(response.data?.sessions)) return response.data.sessions;

    if (Array.isArray(response.data?.classes)) return response.data.classes;

    if (Array.isArray(response.data?.terms)) return response.data.terms;

    return [];
  };

  /* LOAD FILTERS */
  async function loadFilters() {
    try {
      const [setup, options] = await Promise.all([
        AcademicSetupService.getSchoolSetup(),
        AcademicSetupService.getAcademicPeriodOptions(),
      ]);

      // Classes from school setup
      const schoolClasses = setup.classes.map((cls) => ({
        id: cls.id,
        name: cls.name,
      }));

      setClasses(schoolClasses);

      // Sessions and terms from academic period options
      setSessions(options.sessions);
      setTerms(options.terms);

      // Optional: preselect first available values
      if (schoolClasses.length > 0) {
        setClassId(schoolClasses[0].id);
      }

      if (options.sessions.length > 0) {
        setSessionId(options.sessions[0].id);
      }

      if (options.terms.length > 0) {
        setTermId(options.terms[0].id);
      }
    } catch (err) {
      console.error("FILTER ERROR:", err);
      toast.error("Failed to load filters");
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadFilters());
  }, []);

  /* LOAD RESULTS */
  async function loadResults() {
    if (!classId || !sessionId || !termId) {
      toast.error("Select class, session and term.");
      return;
    }

    try {
      setLoading(true);

      const data = await SchoolAdminService.getClassResults({
        classId,
        sessionId,
        termId,
      });

      setResultBatch(data);
    } catch {
      toast.error("Failed to load results.");
      setResultBatch(null);
    } finally {
      setLoading(false);
    }
  }

  /* ACTIONS */
  async function approveBatch() {
    if (!resultBatch) return;

    try {
      await SchoolAdminService.approveResult(resultBatch.batch_id);
      toast.success("Results approved");
      await loadResults();
    } catch {
      toast.error("Approval failed");
    }
  }

  async function publishBatch() {
    if (!resultBatch) return;

    try {
      await SchoolAdminService.publishResult(resultBatch.batch_id);
      toast.success("Results published");
      await loadResults();
    } catch {
      toast.error("Publish failed");
    }
  }

  async function rejectBatch() {
    if (!resultBatch) return;

    if (!rejectNote.trim()) {
      toast.error("Add rejection note");
      return;
    }

    try {
      await SchoolAdminService.rejectResult(resultBatch.batch_id, {
        note: rejectNote,
      });

      toast.success("Results rejected");
      setRejectNote("");
      await loadResults();
    } catch {
      toast.error("Reject failed");
    }
  }

  async function exportResults() {
    if (!classId || !sessionId || !termId) {
      toast.error("Select class, session and term first");
      return;
    }

    try {
      // This is already a Blob because the service returns response.data
      const blob = await SchoolAdminService.exportResults(
        classId,
        sessionId,
        termId,
      );

      const className = classes.find((c) => c.id === classId)?.name ?? "Class";

      const sessionName =
        sessions.find((s) => s.id === sessionId)?.name ?? "Session";

      const termName = terms.find((t) => t.id === termId)?.name ?? "Term";

      const safe = (value: string) =>
        value.replace(/[\\\\/:*?"<>|]/g, "").replace(/\s+/g, "_");

      const filename = `${safe(className)}_${safe(sessionName)}_${safe(termName)}_Results.xlsx`;

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Exported ${filename}`);
    } catch (error: any) {
      try {
        if (error.response?.data instanceof Blob) {
          const text = await error.response.data.text();
          console.error("EXPORT ERROR BODY:", text);
        } else {
          console.error(error);
        }
      } catch {
        console.error(error);
      }

      toast.error("Failed to export results");
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* FILTER CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Result Management</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* FILTERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select onValueChange={setClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSessionId}>
              <SelectTrigger>
                <SelectValue placeholder="Session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setTermId}>
              <SelectTrigger>
                <SelectValue placeholder="Term" />
              </SelectTrigger>
              <SelectContent>
                {terms.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={loadResults} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              View
            </Button>

            <Button variant="secondary" onClick={exportResults}>
              <Download className="w-4 h-4 mr-2" />
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

          {/* REJECT */}
          <div className="flex gap-3">
            <Input
              placeholder="Rejection note"
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

          {/* STATUS */}
          {status && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Status</span>

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

      {/* TABLE UI */}
      {resultBatch && (
        <Card>
          <CardHeader>
            <CardTitle>Students Results</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">Student</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Average</th>
                    <th className="p-2">Position</th>
                    <th className="p-2">Passed</th>
                    <th className="p-2">Failed</th>
                  </tr>
                </thead>

                <tbody>
                  {resultBatch.students.map((s) => (
                    <tr
                      key={s.student_id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-2 font-medium">{s.student_name}</td>
                      <td className="p-2 text-center">{s.total_score}</td>
                      <td className="p-2 text-center">{s.average_score}</td>
                      <td className="p-2 text-center">{s.position}</td>
                      <td className="p-2 text-center text-green-600">
                        {s.passed_subjects}
                      </td>
                      <td className="p-2 text-center text-red-600">
                        {s.failed_subjects}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
