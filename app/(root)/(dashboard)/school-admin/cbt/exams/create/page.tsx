/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { z } from "zod";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { ArrowLeft, Loader2, Save } from "lucide-react";

import Link from "next/link";

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
    class_id: z.string().min(1),

    subject_id: z.string().min(1),

    title: z.string().min(3),

    instructions: z.string().optional(),

    duration_minutes: z.number().min(1),
    total_marks: z.number().min(1),

    starts_at: z.string().min(1),

    ends_at: z.string().min(1),
  })
  .refine((data) => new Date(data.ends_at) > new Date(data.starts_at), {
    path: ["end_time"],
    message: "End time must be after start time.",
  });

type FormValues = z.infer<typeof formSchema>;
export default function CreateExamPage() {
  const router = useRouter();

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
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);

        const classesResponse = await SchoolAdminService.getClasses();

        setClasses(
          classesResponse.data ??
            classesResponse.classes ??
            classesResponse ??
            [],
        );
      } catch {
        toast.error("Failed to load classes.");
      } finally {
        setLoadingData(false);
      }
    }

    void loadData();
  }, []);
  useEffect(() => {
    async function loadSubjects() {
      if (!selectedClassId) {
        setSubjects([]);

        form.setValue("subject_id", "");

        return;
      }

      try {
        const response =
          await SchoolAdminService.getClassSubjects(selectedClassId);

        setSubjects(response.data ?? response.subjects ?? response ?? []);

        // Clear any previously selected subject
        form.setValue("subject_id", "");
      } catch {
        toast.error("Failed to load class subjects.");

        setSubjects([]);
      }
    }

    void loadSubjects();
  }, [selectedClassId, form]);
  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);

      const response = await CBTService.createExam(values);

      if (!response.success) {
        toast.error(response.message);

        return;
      }

      toast.success("Examination created successfully.");

      router.push("/school-admin/cbt/exams");
    } catch (err: any) {
      console.log(err?.response?.data);
      toast.error("Failed to create examination.");
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
            Create CBT Examination
          </h1>

          <p className="mt-2 text-muted-foreground">
            Configure a new computer-based examination by selecting the class,
            subject, schedule, duration and examination details.
          </p>
        </div>
      </div>

      <Separator />

      {loadingData ? (
        <Card>
          <CardContent className="flex h-72 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />

              <p className="text-muted-foreground">Loading academic data...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ====================================================== */}
            {/* Basic Information */}
            {/* ====================================================== */}

            <Card>
              <CardHeader>
                <CardTitle>Examination Information</CardTitle>

                <CardDescription>
                  Basic details of the examination.
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
                          placeholder="e.g. First Term Mathematics Examination"
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
                          placeholder="Provide examination instructions for students..."
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
                  Configure duration, marks and examination schedule.
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
                          placeholder="60"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
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
                          placeholder="100"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
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
                      <FormLabel>Start Date & Time</FormLabel>

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
                      <FormLabel>End Date & Time</FormLabel>

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
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Examination
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
