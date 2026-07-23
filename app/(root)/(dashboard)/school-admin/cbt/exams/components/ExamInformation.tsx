"use client";

import {
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  FileText,
} from "lucide-react";

import { format } from "date-fns";

import { Exam } from "@/app/types/cbt";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ExamInformationProps {
  exam: Exam;
}

export default function ExamInformation({ exam }: ExamInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Examination Information</CardTitle>

        <CardDescription>
          General information, schedule and configuration for this examination.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* ===================================== */}
          {/* LEFT */}
          {/* ===================================== */}

          <div className="space-y-6">
            <InfoRow
              icon={<FileText className="h-4 w-4" />}
              label="Title"
              value={exam.title}
            />

            <InfoRow
              icon={<GraduationCap className="h-4 w-4" />}
              label="Class"
              value={exam.school_class?.name ?? "-"}
            />

            <InfoRow
              icon={<BookOpen className="h-4 w-4" />}
              label="Subject"
              value={exam.subject?.name ?? "-"}
            />

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Instructions
              </p>

              <div className="rounded-lg border bg-muted/40 p-4">
                {exam.instructions ? (
                  <p className="whitespace-pre-wrap leading-7">
                    {exam.instructions}
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    No examination instructions provided.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ===================================== */}
          {/* RIGHT */}
          {/* ===================================== */}

          <div className="space-y-6">
            {/* Settings */}

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock3 className="h-5 w-5 text-primary" />
                  Examination Settings
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <SettingRow
                  label="Duration"
                  value={`${exam.duration_minutes} minutes`}
                />

                <SettingRow label="Total Marks" value={exam.total_marks} />

                <SettingRow
                  label="Questions"
                  value={exam.questions?.length ?? 0}
                />

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>

                  <Badge variant={exam.is_published ? "default" : "secondary"}>
                    {exam.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Examination Schedule
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <SettingRow
                  label="Start"
                  value={format(new Date(exam.starts_at), "PPP p")}
                />

                <SettingRow
                  label="End"
                  value={format(new Date(exam.ends_at), "PPP p")}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;

  label: string;

  value: React.ReactNode;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        {icon}

        <span>{label}</span>
      </div>

      <p className="font-semibold">{value}</p>
    </div>
  );
}

interface SettingRowProps {
  label: string;

  value: React.ReactNode;
}

function SettingRow({ label, value }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>

      <span className="font-semibold">{value}</span>
    </div>
  );
}
