"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import { StudentService } from "@/app/services/student.service";
import { AcademicSetupService } from "@/app/services/academicSetup.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

type SubjectResult = {
  subject_name: string;
  ca_score: number;
  exam_score: number;
  total_score: number;
  grade: string;
  remark?: string;
  teacher_comment?: string;
};

type ResultResponse = {
  student_name: string;
  class_name: string;
  session_name: string;
  term_name: string;

  total_score: number;
  average_score: number;
  position: number | null;

  passed_subjects: number;
  failed_subjects: number;

  subjects: SubjectResult[];
};

type StudentResultApiResponse = {
  success: boolean;
  published: boolean;
  message: string;
  data: ResultResponse | null;
};

export default function StudentResultsPage() {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const [message, setMessage] = useState("");
  const [data, setData] = useState<ResultResponse | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [termId, setTermId] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);

      // Use existing academic setup service
      const current = await AcademicSetupService.getCurrentAcademicPeriod();

      if (!current?.session_id || !current?.term_id) {
        setSessionId(null);
        setTermId(null);
        setData(null);
        setMessage("No active academic session or term.");
        return;
      }

      setSessionId(current.session_id);
      setTermId(current.term_id);

      const response: StudentResultApiResponse =
        await StudentService.getResults(current.session_id, current.term_id);

      setMessage(response.message);

      if (!response.published) {
        setData(null);
        return;
      }

      setData(response.data);
    } catch (error) {
      console.error("Failed to load results:", error);
      setData(null);
      setMessage("Unable to load results at this time.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadReportCard() {
    if (!sessionId || !termId || !data) return;

    try {
      setDownloading(true);

      await StudentService.downloadReportCard(sessionId, termId);
    } catch (error) {
      console.error(error);
    } finally {
      setDownloading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, []);

  if (loading) {
    return <div className="p-6">Loading results...</div>;
  }

  if (!data) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Results</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-2xl font-semibold">Result Not Yet Published</h2>

            <p className="mt-3 max-w-md text-muted-foreground">
              {message ||
                "Your result has not been published yet. Please check back later."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{data.student_name}</h1>

          <p className="text-muted-foreground">
            {data.class_name} • {data.session_name} • {data.term_name}
          </p>
        </div>

        <Button
          onClick={downloadReportCard}
          disabled={downloading || !sessionId || !termId}
        >
          <Download className="mr-2 h-4 w-4" />

          {downloading ? "Downloading..." : "Download Report Card"}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle>Average</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            {data.average_score}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            {data.total_score}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Position</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            {data.position ?? "-"}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Passed</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold text-green-600">
            {data.passed_subjects}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failed</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold text-red-600">
            {data.failed_subjects}
          </CardContent>
        </Card>
      </div>

      {/* Subject Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Breakdown</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>CA</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.subjects.length ? (
                data.subjects.map((subject, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {subject.subject_name}
                    </TableCell>

                    <TableCell>{subject.ca_score}</TableCell>

                    <TableCell>{subject.exam_score}</TableCell>

                    <TableCell className="font-semibold">
                      {subject.total_score}
                    </TableCell>

                    <TableCell>
                      <Badge>{subject.grade}</Badge>
                    </TableCell>

                    <TableCell>
                      {subject.remark || subject.teacher_comment || "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    No subject results available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
