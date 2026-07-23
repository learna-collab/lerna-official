"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useEffect, useState } from "react";

import { toast } from "sonner";

import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Users,
  GraduationCap,
  BookOpen,
  School,
} from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DeleteConfirmDialog } from "@/components/modal/delete-confirm-dialog";

interface SchoolClass {
  id: string;
  name: string;
  level?: string | null;

  students_count?: number;
  teachers_count?: number;
  subjects_count?: number;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);

  const [name, setName] = useState("");

  const [level, setLevel] = useState("");

  const loadClasses = async () => {
    try {
      const response = await SchoolAdminService.getClasses();

      setClasses(
        Array.isArray(response?.classes)
          ? response.classes
          : Array.isArray(response)
            ? response
            : [],
      );
    } catch (error) {
      console.error(error);

      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadClasses);
  }, []);

  const createClass = async () => {
    try {
      await SchoolAdminService.createClass({
        name,
        level,
      });

      toast.success("Class created successfully");

      setCreateOpen(false);

      setName("");

      setLevel("");

      await loadClasses();
    } catch (error) {
      console.error(error);

      toast.error("Failed to create class");
    }
  };

  const openEdit = (schoolClass: SchoolClass) => {
    setSelectedClass(schoolClass);

    setName(schoolClass.name);

    setLevel(schoolClass.level ?? "");

    setEditOpen(true);
  };

  const updateClass = async () => {
    if (!selectedClass) return;

    try {
      await SchoolAdminService.updateClass(selectedClass.id, {
        name,
        level,
      });

      toast.success("Class updated");

      setEditOpen(false);

      await loadClasses();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update class");
    }
  };

  const deleteClass = async (id: string) => {
    try {
      await SchoolAdminService.deleteClass(id);

      toast.success("Class deleted");

      await loadClasses();
    } catch (error: any) {
      console.log(error?.data?.response);

      toast.error("Failed to delete class");
    }
  };

  const totalStudents = classes.reduce(
    (sum, c) => sum + (c.students_count ?? 0),
    0,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {/* HEADER */}

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <School className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">Classes</h1>

              <p className="text-muted-foreground">
                Manage classes, students, teachers and subjects.
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-3 text-sm">
            <span className="rounded-full bg-muted px-3 py-1">
              {classes.length} Classes
            </span>

            <span className="rounded-full bg-muted px-3 py-1">
              {totalStudents} Students
            </span>
          </div>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Class
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Class name e.g JSS 1A"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                placeholder="Level e.g Junior Secondary"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              />

              <Button className="w-full" onClick={createClass}>
                Create Class
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* CONTENT */}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="h-48 animate-pulse" />
            </Card>
          ))}
        </div>
      ) : classes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <School className="mb-4 h-12 w-12 text-muted-foreground" />

            <h2 className="text-xl font-semibold">No classes yet</h2>

            <p className="text-muted-foreground">
              Create your first class to start managing students.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((schoolClass) => (
            <Card
              key={schoolClass.id}
              className="group transition hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {schoolClass.name}
                    </CardTitle>

                    <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {schoolClass.level || "No level"}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <Users className="mx-auto mb-1 h-4 w-4" />

                    <p className="text-lg font-bold">
                      {schoolClass.students_count ?? 0}
                    </p>

                    <p className="text-xs text-muted-foreground">Students</p>
                  </div>

                  <div className="rounded-lg bg-muted p-3 text-center">
                    <GraduationCap className="mx-auto mb-1 h-4 w-4" />

                    <p className="text-lg font-bold">
                      {schoolClass.teachers_count ?? 0}
                    </p>

                    <p className="text-xs text-muted-foreground">Teachers</p>
                  </div>

                  <div className="rounded-lg bg-muted p-3 text-center">
                    <BookOpen className="mx-auto mb-1 h-4 w-4" />

                    <p className="text-lg font-bold">
                      {schoolClass.subjects_count ?? 0}
                    </p>

                    <p className="text-xs text-muted-foreground">Subjects</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/school-admin/classes/${schoolClass.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Manage
                    </Link>
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => openEdit(schoolClass)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <DeleteConfirmDialog
                    title="Delete Class"
                    description={`Are you sure you want to delete "${schoolClass.name}"?`}
                    onConfirm={() => deleteClass(schoolClass.id)}
                    trigger={
                      <Button size="icon" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* EDIT DIALOG */}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input value={name} onChange={(e) => setName(e.target.value)} />

            <Input value={level} onChange={(e) => setLevel(e.target.value)} />

            <Button className="w-full" onClick={updateClass}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
