"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { toast } from "sonner";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FilePlus2,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";

import { CBTService } from "@/app/services/cbt.service";

import { Exam } from "@/app/types/cbt";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CBTDashboardPage() {
  const [loading, setLoading] = useState(true);

  const [exams, setExams] = useState<Exam[]>([]);

  async function loadExams() {
    try {
      setLoading(true);

      const response = await CBTService.getSchoolExams();

      setExams(response.data?.exams ?? []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load examinations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadExams());
  }, []);

  const stats = useMemo(() => {
    const published = exams.filter((exam) => exam.is_published).length;

    const drafts = exams.length - published;

    const totalDuration = exams.reduce(
      (sum, exam) => sum + exam.duration_minutes,
      0,
    );

    const averageDuration =
      exams.length > 0 ? Math.round(totalDuration / exams.length) : 0;

    return {
      total: exams.length,
      published,
      drafts,
      averageDuration,
    };
  }, [exams]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-5 py-8">
      {/* ------------------------------------------------ */}

      {/* HERO */}

      {/* ------------------------------------------------ */}

      <Card className="border-0 bg-gradient-to-r from-primary/10 via-background to-primary/5 shadow-sm">
        <CardContent className="flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-5">
            <Badge className="w-fit">
              <LayoutDashboard className="mr-2 h-3.5 w-3.5" />
              Computer-Based Testing
            </Badge>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                Examination Dashboard
              </h1>

              <p className="max-w-2xl text-muted-foreground">
                Create examinations, organize questions, publish assessments and
                monitor student performance from one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/school-admin/cbt/exams/create">
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  Create Examination
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href="/school-admin/cbt/exams">
                  Manage Exams
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid w-full max-w-md grid-cols-2 gap-4">
            <Card>
              <CardContent className="space-y-2 p-5">
                <BookOpen className="h-8 w-8 text-primary" />

                <p className="text-sm text-muted-foreground">Total Exams</p>

                <h2 className="text-3xl font-bold">{stats.total}</h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-2 p-5">
                <CheckCircle2 className="h-8 w-8 text-green-600" />

                <p className="text-sm text-muted-foreground">Published</p>

                <h2 className="text-3xl font-bold">{stats.published}</h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-2 p-5">
                <Clock3 className="h-8 w-8 text-amber-500" />

                <p className="text-sm text-muted-foreground">Draft Exams</p>

                <h2 className="text-3xl font-bold">{stats.drafts}</h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-2 p-5">
                <GraduationCap className="h-8 w-8 text-indigo-600" />

                <p className="text-sm text-muted-foreground">Avg Duration</p>

                <h2 className="text-3xl font-bold">
                  {stats.averageDuration}
                  <span className="ml-1 text-base font-medium">mins</span>
                </h2>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      {/* ====================================================== */}
      {/* QUICK ACTIONS */}
      {/* ====================================================== */}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Quick Actions</h2>

          <p className="text-sm text-muted-foreground">
            Frequently used examination management tasks.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Link href="/dashboard/school-admin/cbt/exams/create">
            <Card className="group h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FilePlus2 className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-semibold">Create Exam</h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Create a new CBT examination and assign it to a class and
                    subject.
                  </p>
                </div>

                <div className="mt-8 flex items-center text-sm font-medium text-primary">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/school-admin/cbt/exams">
            <Card className="group h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                    <BookOpen className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-semibold">Manage Exams</h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Edit, publish or organize all CBT examinations from one
                    place.
                  </p>
                </div>

                <div className="mt-8 flex items-center text-sm font-medium text-primary">
                  Open
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/school-admin/cbt/results">
            <Card className="group h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-semibold">View Results</h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Monitor student performance and examination statistics.
                  </p>
                </div>

                <div className="mt-8 flex items-center text-sm font-medium text-primary">
                  View Results
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/school-admin/cbt/questions">
            <Card className="group h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-semibold">Question Bank</h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Maintain and organize questions across examinations.
                  </p>
                </div>

                <div className="mt-8 flex items-center text-sm font-medium text-primary">
                  Manage
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
      {/* ====================================================== */}
      {/* RECENT EXAMINATIONS */}
      {/* ====================================================== */}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent Examinations</h2>

            <p className="text-sm text-muted-foreground">
              Recently created CBT examinations.
            </p>
          </div>

          <Button variant="outline" asChild>
            <Link href="/dashboard/school-admin/cbt/exams">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="h-[210px] animate-pulse">
                <CardContent className="p-6">
                  <div className="h-5 w-40 rounded bg-muted" />

                  <div className="mt-4 h-4 w-full rounded bg-muted" />

                  <div className="mt-2 h-4 w-3/4 rounded bg-muted" />

                  <div className="mt-10 h-4 w-1/2 rounded bg-muted" />

                  <div className="mt-8 h-10 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : exams.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <BookOpen className="mb-5 h-14 w-14 text-muted-foreground/40" />

              <h3 className="text-xl font-semibold">No examinations yet</h3>

              <p className="mt-2 max-w-md text-center text-muted-foreground">
                Create your first CBT examination to begin assessing students
                online.
              </p>

              <Button className="mt-8" asChild>
                <Link href="/dashboard/school-admin/cbt/exams/create">
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  Create Examination
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {exams.slice(0, 6).map((exam) => (
              <Card
                key={exam.id}
                className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="line-clamp-2">
                        {exam.title}
                      </CardTitle>

                      <CardDescription className="mt-2 line-clamp-2">
                        {exam.instructions || "No instructions provided."}
                      </CardDescription>
                    </div>

                    <Badge
                      variant={exam.is_published ? "default" : "secondary"}
                    >
                      {exam.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Duration
                      </p>

                      <p className="mt-1 font-semibold">
                        {exam.duration_minutes} mins
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Marks
                      </p>

                      <p className="mt-1 font-semibold">{exam.total_marks}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Start</span>

                      <span className="font-medium">
                        {new Date(exam.starts_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">End</span>

                      <span className="font-medium">
                        {new Date(exam.ends_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline" asChild>
                    <Link href={`/school-admin/cbt/exams/${exam.id}`}>
                      Manage Examination
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
