/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import Link from "next/link";

import { z } from "zod";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { ArrowLeft, Loader2, Save } from "lucide-react";

import { CBTService } from "@/app/services/cbt.service";
import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";

const formSchema = z
  .object({
    class_id: z.string().min(1, "Class is required"),

    subject_id: z.string().min(1, "Subject is required"),

    title: z.string().min(3, "Title is required"),

    instructions: z.string().optional(),

    duration_minutes: z.number().min(1),

    total_marks: z.number().min(1),

    starts_at: z.string().min(1),

    ends_at: z.string().min(1),
  })
  .refine((data) => new Date(data.ends_at) > new Date(data.starts_at), {
    path: ["ends_at"],
    message: "End time must be after start time.",
  });

type FormValues = z.infer<typeof formSchema>;

export default function EditExamPage() {
  const router = useRouter();

  const params = useParams();

  const examId = params.examId as string;

  const [loading, setLoading] = useState(false);

  const [loadingData, setLoadingData] = useState(true);

  const [classes, setClasses] = useState<any[]>([]);

  const [subjects, setSubjects] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      class_id: "",

      subject_id: "",

      title: "",

      instructions: "",

      duration_minutes: 60,

      total_marks: 100,

      starts_at: "",

      ends_at: "",
    },
  });

  const selectedClassId = form.watch("class_id");
  // ======================================================
  // Load Classes + Exam
  // ======================================================

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoadingData(true);

        const classesResponse = await SchoolAdminService.getClasses();

        const classList =
          classesResponse.data ??
          classesResponse.classes ??
          classesResponse ??
          [];

        setClasses(classList);

        const examResponse = await CBTService.getExam(examId);

        const exam = examResponse.data ?? examResponse;

        if (!exam) {
          toast.error("Examination not found.");

          router.push("/school-admin/cbt/exams");

          return;
        }

        // Load subjects for this class
        const examData: any = exam;

        const subjectsResponse = await SchoolAdminService.getClassSubjects(
          examData.class_id,
        );

        const subjectList =
          subjectsResponse.data ??
          subjectsResponse.subjects ??
          subjectsResponse ??
          [];

        setSubjects(subjectList);

        form.reset({
          class_id: examData.class_id,
          subject_id: examData.subject_id,
          title: examData.title,
          instructions: examData.instructions ?? "",
          duration_minutes: examData.duration_minutes,
          total_marks: examData.total_marks,
          starts_at: examData.starts_at
            ? new Date(examData.starts_at).toISOString().slice(0, 16)
            : "",
          ends_at: examData.ends_at
            ? new Date(examData.ends_at).toISOString().slice(0, 16)
            : "",
        });
      } catch (err) {
        console.error(err);

        toast.error("Failed to load examination.");

        router.push("/school-admin/cbt/exams");
      } finally {
        setLoadingData(false);
      }
    }

    void loadInitialData();
  }, [examId, form, router]);

  // ======================================================
  // Reload subjects whenever class changes
  // ======================================================

  useEffect(() => {
    async function loadSubjects() {
      if (!selectedClassId) {
        setSubjects([]);

        return;
      }

      try {
        const response =
          await SchoolAdminService.getClassSubjects(selectedClassId);

        const subjectList =
          response.data ?? response.subjects ?? response ?? [];

        setSubjects(subjectList);

        const currentSubject = form.getValues("subject_id");

        if (
          currentSubject &&
          !subjectList.some((s: any) => s.id === currentSubject)
        ) {
          form.setValue("subject_id", "");
        }
      } catch {
        toast.error("Failed to load class subjects.");

        setSubjects([]);
      }
    }

    void loadSubjects();
  }, [selectedClassId, form]);
  // ======================================================
  // Update Examination
  // ======================================================

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);

      const payload = {
        class_id: values.class_id,
        subject_id: values.subject_id,
        title: values.title,
        instructions: values.instructions,
        duration_minutes: values.duration_minutes,
        total_marks: values.total_marks,
        starts_at: values.starts_at,
        ends_at: values.ends_at,
      };

      const response = await CBTService.updateExam(examId, payload);

      if (!response.success) {
        toast.error(response.message ?? "Failed to update examination.");

        return;
      }

      toast.success("Examination updated successfully.");

      router.push("/school-admin/cbt/exams");
    } catch (err: any) {
      console.error(err?.response?.data ?? err);

      toast.error(
        err?.response?.data?.message ?? "Failed to update examination.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}

      <div className="flex items-start justify-between">
        <div>
          <Button asChild variant="ghost" className="mb-4 px-0">
            <Link href="/school-admin/cbt/exams">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exams
            </Link>
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">
            Edit CBT Examination
          </h1>

          <p className="mt-2 text-muted-foreground">
            Update the examination details, schedule and settings.
          </p>
        </div>
      </div>

      <Separator />

      {loadingData ? (
        <Card>
          <CardContent className="flex h-72 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />

              <p className="text-muted-foreground">Loading examination...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ====================================================== */}
            {/* Examination Information */}
            {/* ====================================================== */}

            <Card>
              <CardHeader>
                <CardTitle>Examination Information</CardTitle>

                <CardDescription>
                  Update the examination details.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="class_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {classes.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedClassId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                selectedClassId
                                  ? "Select subject"
                                  : "Select class first"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {subjects.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Examination Title</FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Enter examination title"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Instructions</FormLabel>

                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="Instructions for students..."
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            {/* ====================================================== */}
            {/* Examination Settings */}
            {/* ====================================================== */}

            <Card>
              <CardHeader>
                <CardTitle>Examination Settings</CardTitle>

                <CardDescription>
                  Update duration, marks and examination schedule.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="duration_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Minutes)</FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="total_marks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Marks</FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="starts_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date &amp; Time</FormLabel>

                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ends_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date &amp; Time</FormLabel>

                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* ====================================================== */}
            {/* Actions */}
            {/* ====================================================== */}

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="outline" asChild>
                <Link href="/school-admin/cbt/exams">Cancel</Link>
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Examination
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
