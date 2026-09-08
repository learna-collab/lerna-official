"use client";

import Link from "next/link";
import { BookOpen, GraduationCap, School } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AcademicSummaryProps {
  configured: boolean;
  templateName?: string | null;
  classCount: number;
  subjectCount: number;
}

export function AcademicSummary({
  configured,
  templateName,
  classCount,
  subjectCount,
}: AcademicSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* ======================================================
          TEMPLATE
      ====================================================== */}
      <Link href="/academic-structure" className="block">
        <Card className="h-full transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Academic Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">
                  {configured
                    ? (templateName ?? "Configured")
                    : (templateName ?? "No Template Selected")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {configured
                    ? "School curriculum configured"
                    : "Select a curriculum template"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* ======================================================
          CLASSES
      ====================================================== */}
      <Link href="/classes" className="block">
        <Card className="h-full transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <School className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{classCount}</p>
                <p className="text-sm text-muted-foreground">Active Classes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* ======================================================
          SUBJECTS
      ====================================================== */}
      <Link href="/subjects" className="block">
        <Card className="h-full transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{subjectCount}</p>
                <p className="text-sm text-muted-foreground">
                  Available Subjects
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
