"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import { Search, Plus, Pencil, Trash2, BookOpen } from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/modal/delete-confirm-dialog";

interface Subject {
  id: string;
  name: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [createName, setCreateName] = useState("");

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const [editName, setEditName] = useState("");

  const loadSubjects = async () => {
    try {
      const response = await SchoolAdminService.getSubjects();

      const data = Array.isArray(response) ? response : [];

      setSubjects(data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadSubjects());
  }, []);

  const filteredSubjects = useMemo(() => {
    const term = search.toLowerCase();

    return subjects.filter((subject) =>
      subject.name?.toLowerCase().includes(term),
    );
  }, [subjects, search]);

  const createSubject = async () => {
    if (!createName.trim()) {
      toast.error("Subject name is required");

      return;
    }

    try {
      await SchoolAdminService.createSubject({
        name: createName,
      });

      toast.success("Subject created");

      setCreateName("");

      await loadSubjects();
      setOpen(false);
    } catch (error) {
      console.error(error);

      toast.error("Failed to create subject");
    }
  };

  const openEdit = (subject: Subject) => {
    setSelectedSubject(subject);

    setEditName(subject.name);
  };

  const updateSubject = async () => {
    if (!selectedSubject) return;

    try {
      await SchoolAdminService.updateSubject(selectedSubject.id, {
        name: editName,
      });

      toast.success("Subject updated");

      await loadSubjects();

      setSelectedSubject(null);
      setOpen(false);
    } catch (error) {
      console.error(error);

      toast.error("Failed to update subject");
    }
  };

  const deleteSubject = async (subjectId: string) => {
    try {
      await SchoolAdminService.deleteSubject(subjectId);

      toast.success("Subject deleted");

      await loadSubjects();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete subject");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subjects</h1>

          <p className="text-muted-foreground">Manage school subjects</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Subject
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Subject</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Subject Name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
              />

              <Button className="w-full" onClick={createSubject}>
                Create Subject
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Directory</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="relative max-w-md">
            <Search className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />

            <Input
              className="pl-10"
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="py-10 text-center">Loading subjects...</div>
          ) : filteredSubjects.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No subjects found
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {filteredSubjects.map((subject) => (
                <Card key={subject.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />

                          <span className="font-medium">{subject.name}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => openEdit(subject)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Subject</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                              />

                              <Button
                                className="w-full"
                                onClick={updateSubject}
                              >
                                Save Changes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <DeleteConfirmDialog
                          title="Delete Subject"
                          description={`Are you sure you want to delete "${subject.name}"?`}
                          onConfirm={() => deleteSubject(subject.id)}
                          trigger={
                            <Button size="icon" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    </div>
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
