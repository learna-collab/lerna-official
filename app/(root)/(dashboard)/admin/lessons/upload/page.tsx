"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, ExternalLink, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import {
  SuperAdminLessonService,
  LessonResponse,
} from "@/app/services/super-admin-lesson.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  id: string;
  name: string;
};

export default function UploadLessonPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(false);

  const [classTemplateId, setClassTemplateId] = useState("");
  const [subjectTemplateId, setSubjectTemplateId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [termId, setTermId] = useState("");
  const [weekNumber, setWeekNumber] = useState("1");
  const [file, setFile] = useState<File | null>(null);

  const [existingLesson, setExistingLesson] = useState<LessonResponse | null>(
    null,
  );

  const [classes, setClasses] = useState<Option[]>([]);
  const [subjects, setSubjects] = useState<Option[]>([]);
  const [sessions, setSessions] = useState<Option[]>([]);
  const [terms, setTerms] = useState<Option[]>([]);

  // -------------------------------------------------------
  // Load initial options
  // -------------------------------------------------------

  async function loadOptions() {
    try {
      setLoadingOptions(true);

      const [classData, sessionData, termData] = await Promise.all([
        SuperAdminLessonService.getClasses(),
        SuperAdminLessonService.getSessions(),
        SuperAdminLessonService.getTerms(),
      ]);

      setClasses(classData);
      setSessions(sessionData);
      setTerms(termData);

      if (classData.length) setClassTemplateId(classData[0].id);
      if (sessionData.length) setSessionId(sessionData[0].id);
      if (termData.length) setTermId(termData[0].id);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ?? "Failed to load lesson options.",
      );
    } finally {
      setLoadingOptions(false);
    }
  }

  // -------------------------------------------------------
  // Load subjects
  // -------------------------------------------------------

  async function loadClassSubjects(classId: string) {
    if (!classId) {
      setSubjects([]);
      setSubjectTemplateId("");
      return;
    }

    try {
      setLoadingSubjects(true);

      const data = await SuperAdminLessonService.getClassSubjects(classId);

      setSubjects(data);

      if (data.length) {
        setSubjectTemplateId(data[0].id);
      } else {
        setSubjectTemplateId("");
      }
    } catch (error: any) {
      setSubjects([]);
      setSubjectTemplateId("");

      toast.error(
        error?.response?.data?.detail ??
          "Failed to load subjects for this class.",
      );
    } finally {
      setLoadingSubjects(false);
    }
  }

  // -------------------------------------------------------
  // Check if lesson already exists
  // -------------------------------------------------------

  async function loadExistingLesson() {
    if (
      !classTemplateId ||
      !subjectTemplateId ||
      !sessionId ||
      !termId ||
      !weekNumber
    ) {
      setExistingLesson(null);
      return;
    }

    try {
      setCheckingExisting(true);

      const lessons = await SuperAdminLessonService.getLessons({
        classTemplateId,
        subjectTemplateId,
        sessionId,
        termId,
        weekNumber: Number(weekNumber),
      });

      const match =
        lessons.find(
          (lesson) =>
            lesson.week_number === Number(weekNumber) &&
            lesson.subject_name ===
              subjects.find((s) => s.id === subjectTemplateId)?.name,
        ) ?? null;

      setExistingLesson(match);
    } catch {
      setExistingLesson(null);
    } finally {
      setCheckingExisting(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadOptions());
  }, []);

  useEffect(() => {
    if (classTemplateId) {
      void Promise.resolve().then(() => loadClassSubjects(classTemplateId));
    }
  }, [classTemplateId]);

  useEffect(() => {
    if (
      classTemplateId &&
      subjectTemplateId &&
      sessionId &&
      termId &&
      weekNumber
    ) {
      void Promise.resolve().then(() => loadExistingLesson());
    } else {
      void Promise.resolve().then(() => setExistingLesson(null));
    }
  }, [classTemplateId, subjectTemplateId, sessionId, termId, weekNumber]);

  // -------------------------------------------------------
  // Submit
  // -------------------------------------------------------

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!classTemplateId || !subjectTemplateId || !sessionId || !termId) {
      toast.error("Please complete all selections.");
      return;
    }

    if (!file) {
      toast.error("Please choose a lesson file.");
      return;
    }

    try {
      setLoading(true);

      const lesson = await SuperAdminLessonService.uploadLesson({
        class_template_id: classTemplateId,
        subject_template_id: subjectTemplateId,
        session_id: sessionId,
        term_id: termId,
        week_number: Number(weekNumber),
        file,
      });

      toast.success(
        existingLesson
          ? "Lesson replaced successfully."
          : "Lesson uploaded successfully.",
      );

      router.push(`/admin/lessons/${lesson.id}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail ?? "Lesson upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Upload Lesson Note
        </h1>

        <p className="mt-2 text-muted-foreground">
          Upload a DOCX or PDF lesson note. The system will automatically
          extract the ALF sections and create the lesson.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Information</CardTitle>
        </CardHeader>

        <CardContent>
          {loadingOptions ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Loading lesson options...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Grid */}

              <div className="grid gap-5 md:grid-cols-2">
                {/* Class */}

                <div className="space-y-2">
                  <Label>Class</Label>

                  <Select
                    value={classTemplateId}
                    onValueChange={(value) => {
                      setClassTemplateId(value);
                      setSubjectTemplateId("");
                      setExistingLesson(null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>

                    <SelectContent>
                      {classes.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}

                <div className="space-y-2">
                  <Label>Subject</Label>

                  <Select
                    value={subjectTemplateId}
                    onValueChange={setSubjectTemplateId}
                    disabled={
                      !classTemplateId ||
                      loadingSubjects ||
                      subjects.length === 0
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingSubjects
                            ? "Loading subjects..."
                            : subjects.length === 0
                              ? "No subjects available"
                              : "Select subject"
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {subjects.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Session */}

                <div className="space-y-2">
                  <Label>Session</Label>

                  <Select value={sessionId} onValueChange={setSessionId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session" />
                    </SelectTrigger>

                    <SelectContent>
                      {sessions.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Term */}

                <div className="space-y-2">
                  <Label>Term</Label>

                  <Select value={termId} onValueChange={setTermId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>

                    <SelectContent>
                      {terms.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Week */}

                <div className="space-y-2">
                  <Label>Week Number</Label>

                  <Input
                    type="number"
                    min={1}
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(e.target.value)}
                  />
                </div>
              </div>

              {/* Existing Lesson */}

              {checkingExisting ? (
                <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Checking this lesson slot...
                </div>
              ) : existingLesson ? (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-amber-900">
                        Existing lesson found
                      </h3>

                      <p className="mt-1 text-sm text-amber-800">
                        Week {existingLesson.week_number} •{" "}
                        {existingLesson.subject_name}
                      </p>
                    </div>

                    <FileText className="h-5 w-5 text-amber-700" />
                  </div>

                  <div className="mt-3 rounded-lg bg-white p-3">
                    <p className="font-medium">{existingLesson.title}</p>

                    <p className="text-sm text-muted-foreground">
                      {existingLesson.topic}
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/lessons/${existingLesson.id}`)
                      }
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `/admin/lessons/${existingLesson.id}`,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open
                    </Button>
                  </div>

                  <p className="mt-3 text-xs text-amber-900">
                    Uploading a new file will replace this lesson.
                  </p>
                </div>
              ) : null}

              {/* Upload */}

              <div className="space-y-3">
                <Label>
                  {existingLesson ? "Replace Lesson File" : "Lesson File"}
                </Label>

                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-8 transition hover:border-blue-500 hover:bg-blue-50/50">
                  <Upload className="mb-3 h-10 w-10 text-slate-500 group-hover:text-blue-600" />

                  <span className="font-semibold">
                    {existingLesson
                      ? "Choose replacement file"
                      : "Choose lesson file"}
                  </span>

                  <span className="mt-1 text-sm text-muted-foreground">
                    DOCX or PDF • Click to browse
                  </span>

                  <input
                    type="file"
                    accept=".docx,.pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                {file && (
                  <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />

                    <span className="truncate font-medium">{file.name}</span>
                  </div>
                )}
              </div>

              {/* Actions */}

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading || !subjectTemplateId || loadingSubjects}
                >
                  {loading
                    ? existingLesson
                      ? "Replacing..."
                      : "Uploading..."
                    : existingLesson
                      ? "Replace Lesson"
                      : "Upload Lesson"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
