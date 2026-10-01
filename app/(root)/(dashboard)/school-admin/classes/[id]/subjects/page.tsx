"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface Subject {
  id: string;
  name: string;
}

export default function ClassSubjectsPage() {
  const params = useParams();
  const [open, setOpen] = useState(false);

  const classId = params.id as string;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [assigned, available] = await Promise.all([
        SchoolAdminService.getClassSubjects(classId),
        SchoolAdminService.getSubjects(),
      ]);

      setSubjects(
        Array.isArray(assigned?.subjects)
          ? assigned.subjects
          : Array.isArray(assigned)
            ? assigned
            : [],
      );

      setAllSubjects(
        Array.isArray((available as any)?.subjects)
          ? (available as any).subjects
          : Array.isArray(available)
            ? available
            : [],
      );
    } catch (error) {
      console.error(error);

      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      void Promise.resolve().then(() => loadData());
    }
  }, [classId]);

  const assignedIds = new Set(subjects.map((s) => s.id));

  const availableSubjects = allSubjects.filter(
    (subject) => !assignedIds.has(subject.id),
  );

  const assignSubject = async (subjectId: string) => {
    try {
      await SchoolAdminService.assignSubjectToClass(classId, subjectId);

      toast.success("Subject assigned");

      await loadData();

      setOpen(false); // close modal
    } catch (error) {
      console.error(error);

      toast.error("Failed to assign subject");
    }
  };

  const removeSubject = async (subjectId: string) => {
    try {
      await SchoolAdminService.removeSubjectFromClass(classId, subjectId);

      toast.success("Subject removed");

      await loadData();
    } catch (error) {
      console.error(error);

      toast.error("Failed to remove subject");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Class Subjects</h1>

          <p className="text-muted-foreground">
            Manage subjects assigned to this class
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Assign Subject
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Subject</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              {availableSubjects.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No available subjects
                </p>
              ) : (
                availableSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span>{subject.name}</span>

                    <Button size="sm" onClick={() => assignSubject(subject.id)}>
                      Add
                    </Button>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Subjects</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-8 text-center">Loading subjects...</div>
          ) : subjects.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              No subjects assigned
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {subjects.map((subject) => (
                <Card key={subject.id}>
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <h3 className="font-medium">{subject.name}</h3>
                    </div>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => removeSubject(subject.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
