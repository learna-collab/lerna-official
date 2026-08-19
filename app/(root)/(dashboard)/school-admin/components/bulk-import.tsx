"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { toast } from "sonner";
import { Upload, Download, FileSpreadsheet, Loader2 } from "lucide-react";

import { RegistrationService } from "@/app/services/registration.service";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

export default function BulkImport() {
  const [studentFile, setStudentFile] = useState<File | null>(null);

  const [teacherFile, setTeacherFile] = useState<File | null>(null);

  const [loadingStudent, setLoadingStudent] = useState(false);

  const [loadingTeacher, setLoadingTeacher] = useState(false);

  const [downloadingStudent, setDownloadingStudent] = useState(false);

  const [downloadingTeacher, setDownloadingTeacher] = useState(false);

  function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = filename;

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);
  }

  // =====================================
  // DOWNLOAD STUDENT TEMPLATE
  // =====================================

  async function downloadStudentTemplate() {
    try {
      setDownloadingStudent(true);

      const blob = await RegistrationService.downloadStudentTemplate();

      downloadBlob(blob, "student_import_template.xlsx");

      toast.success("Student template downloaded.");
    } catch {
      toast.error("Unable to download template.");
    } finally {
      setDownloadingStudent(false);
    }
  }

  // =====================================
  // DOWNLOAD TEACHER TEMPLATE
  // =====================================

  async function downloadTeacherTemplate() {
    try {
      setDownloadingTeacher(true);

      const blob = await RegistrationService.downloadTeacherTemplate();

      downloadBlob(blob, "teacher_import_template.xlsx");

      toast.success("Teacher template downloaded.");
    } catch {
      toast.error("Unable to download template.");
    } finally {
      setDownloadingTeacher(false);
    }
  }

  // =====================================
  // IMPORT STUDENTS
  // =====================================

  async function importStudents() {
    if (!studentFile) {
      toast.error("Please choose a student Excel file.");
      return;
    }

    try {
      setLoadingStudent(true);

      const blob = await RegistrationService.importStudents(studentFile);

      downloadBlob(blob, "student_import_report.xlsx");

      toast.success(
        "Student import completed. Check the downloaded report for successful and failed rows.",
      );

      setStudentFile(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ?? err?.message ?? "Student import failed.",
      );
    } finally {
      setLoadingStudent(false);
    }
  }
  // =====================================
  // IMPORT TEACHERS
  // =====================================

  async function importTeachers() {
    if (!teacherFile) {
      toast.error("Please choose a teacher Excel file.");
      return;
    }

    try {
      setLoadingTeacher(true);

      const blob = await RegistrationService.importTeachers(teacherFile);

      downloadBlob(blob, "teacher_import_report.xlsx");

      toast.success(
        "Teacher import completed. Check the downloaded report for successful and failed rows.",
      );

      setTeacherFile(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ?? err?.message ?? "Teacher import failed.",
      );
    } finally {
      setLoadingTeacher(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* =============================== */}
      {/* STUDENT IMPORT */}
      {/* =============================== */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Student Bulk Import
          </CardTitle>

          <CardDescription>
            Download the Excel template, complete it and upload it to create
            multiple student accounts instantly.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <Button
            variant="outline"
            className="w-full"
            onClick={downloadStudentTemplate}
            disabled={downloadingStudent}
          >
            {downloadingStudent ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Student Template
              </>
            )}
          </Button>

          <div className="space-y-2">
            <Label>Upload Completed Template</Label>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setStudentFile(e.target.files?.[0] || null)}
              className="block w-full rounded-lg border p-3 text-sm"
            />
          </div>

          <Button
            className="w-full"
            disabled={loadingStudent}
            onClick={importStudents}
          >
            {loadingStudent ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing Students...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import Students
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      {/* =============================== */}
      {/* TEACHER IMPORT */}
      {/* =============================== */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Teacher Bulk Import
          </CardTitle>

          <CardDescription>
            Download the Excel template, fill in the teacher information, then
            upload it to automatically create teacher accounts.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <Button
            variant="outline"
            className="w-full"
            onClick={downloadTeacherTemplate}
            disabled={downloadingTeacher}
          >
            {downloadingTeacher ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Teacher Template
              </>
            )}
          </Button>

          <div className="space-y-2">
            <Label>Upload Completed Template</Label>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setTeacherFile(e.target.files?.[0] ?? null)}
              className="block w-full rounded-lg border p-3 text-sm"
            />
          </div>

          <Button
            className="w-full"
            disabled={loadingTeacher}
            onClick={importTeachers}
          >
            {loadingTeacher ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing Teachers...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import Teachers
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
