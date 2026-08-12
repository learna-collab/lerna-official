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
const LESSON_DAYS = [
  { label: "Monday", value: "Day 1" },
  { label: "Tuesday", value: "Day 2" },
  { label: "Wednesday", value: "Day 3" },
  { label: "Thursday", value: "Day 4" },
  { label: "Friday", value: "Day 5" },
];

export default function UploadLessonPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(false);

  // Form state
  const [classTemplateId, setClassTemplateId] = useState("");
  const [subjectTemplateId, setSubjectTemplateId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [termId, setTermId] = useState("");
  const [weekNumber, setWeekNumber] = useState("1");
  const [lessonDay, setLessonDay] = useState("Day 1");
  const [file, setFile] = useState<File | null>(null);

  // Existing uploaded lesson
  const [existingLesson, setExistingLesson] = useState<LessonResponse | null>(
    null,
  );

  // API-loaded options
  const [classes, setClasses] = useState<Option[]>([]);
  const [subjects, setSubjects] = useState<Option[]>([]);
  const [sessions, setSessions] = useState<Option[]>([]);
  const [terms, setTerms] = useState<Option[]>([]);

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

      if (classData.length > 0) {
        setClassTemplateId(classData[0].id);
      }

      if (sessionData.length > 0) {
        setSessionId(sessionData[0].id);
      }

      if (termData.length > 0) {
        setTermId(termData[0].id);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ?? "Failed to load lesson options.",
      );
    } finally {
      setLoadingOptions(false);
    }
  }

  // Load subjects for selected class
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

      // Auto-select first subject
      if (data.length > 0) {
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

  // Load existing uploaded lesson for the selected filters
  async function loadExistingLesson() {
    if (
      !classTemplateId ||
      !subjectTemplateId ||
      !sessionId ||
      !termId ||
      !weekNumber ||
      !lessonDay
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
            lesson.lesson_day === lessonDay,
        ) ?? null;

      setExistingLesson(match);
    } catch (error) {
      console.error(error);
      setExistingLesson(null);
    } finally {
      setCheckingExisting(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadOptions());
  }, []);

  // Reload subjects whenever class changes
  useEffect(() => {
    if (classTemplateId) {
      void Promise.resolve().then(() => loadClassSubjects(classTemplateId));
    }
  }, [classTemplateId]);

  // Check existing lesson whenever filters change
  useEffect(() => {
    void Promise.resolve().then(() => loadExistingLesson());
  }, [
    classTemplateId,
    subjectTemplateId,
    sessionId,
    termId,
    weekNumber,
    lessonDay,
  ]);

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
        lesson_day: lessonDay,
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
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Upload Daily Lesson
        </h1>

        <p className="text-muted-foreground mt-1">
          Upload a DOCX or PDF lesson note. The ALF sections will be extracted
          automatically.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Information</CardTitle>
        </CardHeader>

        <CardContent>
          {loadingOptions ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading lesson options...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    !classTemplateId || loadingSubjects || subjects.length === 0
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

                {classTemplateId &&
                  subjects.length === 0 &&
                  !loadingSubjects && (
                    <p className="text-xs text-muted-foreground">
                      No subjects have been assigned to this class template.
                    </p>
                  )}
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

              {/* Week & Day */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Week Number</Label>

                  <Input
                    type="number"
                    min={1}
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(e.target.value)}
                  />
                </div>

                {/* Lesson Day */}
                <div className="space-y-2">
                  <Label>Lesson Day</Label>

                  <Select value={lessonDay} onValueChange={setLessonDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>

                    <SelectContent>
                      {LESSON_DAYS.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Existing lesson section remains unchanged */}

              {/* File Upload */}
              <div className="space-y-2">
                <Label>
                  {existingLesson
                    ? "Replace Lesson File (DOCX or PDF)"
                    : "Lesson File (DOCX or PDF)"}
                </Label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center transition hover:bg-muted/50">
                  <Upload className="mb-3 h-8 w-8 text-muted-foreground" />

                  <span className="text-sm font-medium">
                    Click to choose a file
                  </span>

                  <span className="text-xs text-muted-foreground">
                    Supported formats: .docx, .pdf
                  </span>

                  <input
                    type="file"
                    accept=".docx,.pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                {file && (
                  <div className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />

                    <span className="truncate">{file.name}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
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
